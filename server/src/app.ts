import { App } from '@tinyhttp/app'
import { cookieParser } from '@tinyhttp/cookie-parser'
import { cors } from '@tinyhttp/cors'
import { logger } from '@tinyhttp/logger'
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http'
import type { HandleUploadBody } from '@vercel/blob/client'
import { handleUpload } from '@vercel/blob/client'
import { fromNodeHeaders } from 'better-auth/node'
import { toNodeHandler } from 'better-auth/node'
import chalk from 'chalk'

import { auth } from './auth'
import { env } from './env'
import { prisma } from './prisma'
import { appRouter } from './trpc/appRouter'
import { createContext } from './trpc/context'

const app = new App({
	settings: { xPoweredBy: false },
	onError(error, _, res) {
		console.error(error)
		res.status(500).send('Internal server error')
	},
})

const allowedOrigin = (requestOrigin: string | undefined): boolean => {
	if (!requestOrigin) return false
	const normalized = env.FRONTEND_URL.replace(/\/$/, '')
	if (requestOrigin === normalized || requestOrigin === env.FRONTEND_URL) {
		return true
	}
	if (
		env.NODE_ENV === 'development'
		&& /^https?:\/\/localhost(:\d+)?$/.test(requestOrigin)
	) {
		return true
	}
	return false
}

app.use(
	cors({
		origin: (req) => {
			const requestOrigin = req.headers.origin
			if (requestOrigin && allowedOrigin(requestOrigin)) {
				return requestOrigin
			}
			return env.FRONTEND_URL
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		exposedHeaders: ['Access-Control-Allow-Credentials'],
	}),
)
app.use(cookieParser())

app.use(async (req, res, next) => {
	if (req.path.startsWith('/api/auth')) {
		await toNodeHandler(auth)(req, res)
		return
	}
	next?.()
})

app.use(async (req, res, next) => {
	if (req.method !== 'POST' || req.path !== '/avatar/upload') {
		return next?.()
	}

	try {
		const chunks: Buffer[] = []
		for await (const chunk of req) {
			chunks.push(chunk as Buffer)
		}
		const bodyStr = Buffer.concat(chunks).toString('utf-8')
		const body = JSON.parse(bodyStr || '{}') as HandleUploadBody

		const session = await auth.api.getSession({
			headers: fromNodeHeaders(
				req.headers as Record<string, string | string[] | undefined>,
			),
		})
		if (!session?.user?.id) {
			res.status(401).json({ error: 'Unauthorized' })
			return
		}

		const userId =
			typeof session.user.id === 'number' ?
				session.user.id
			:	Number(session.user.id)
		if (Number.isNaN(userId)) {
			res.status(401).json({ error: 'Unauthorized' })
			return
		}

		const protocol = req.headers['x-forwarded-proto'] ?? 'http'
		const host = req.headers.host ?? `localhost:${env.PORT}`
		const url = `${protocol}://${host}${req.url ?? '/avatar/upload'}`
		const webRequest = new Request(url, {
			method: 'POST',
			headers: req.headers as HeadersInit,
			body: bodyStr || undefined,
		})

		const jsonResponse = await handleUpload({
			body,
			request: webRequest,
			onBeforeGenerateToken: async () => ({
				allowedContentTypes: [
					'image/jpeg',
					'image/png',
					'image/webp',
					'image/gif',
				],
				addRandomSuffix: true,
				tokenPayload: JSON.stringify({ userId }),
			}),
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				try {
					const { userId: id } = JSON.parse(tokenPayload ?? '{}') as {
						userId: number
					}
					if (
						typeof id === 'number'
						&& !Number.isNaN(id)
						&& blob?.url
					) {
						await prisma.user.update({
							where: { id },
							data: { avatarUrl: blob.url },
						})
					}
				} catch {
					// Client also calls updateAvatar with blob.url; ignore callback errors
				}
			},
		})

		res.status(200).json(jsonResponse)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Upload failed'
		res.status(400).json({ error: message })
	}
})

if (env.NODE_ENV === 'development') {
	app.use(
		logger({
			methods: ['GET', 'POST'],
			timestamp: { format: 'HH:mm:ss' },
			output: { callback: console.log, color: true },
		}),
	)
}

app.use(async (req, res, next) => {
	const prefix = '/_'
	if (!req.path.startsWith(prefix)) return next?.()

	res.statusCode = 200

	await nodeHTTPRequestHandler({
		router: appRouter,
		createContext,
		req,
		res,
		path: req.path.slice(prefix.length + 1),
		onError({ error }) {
			if (error.code === 'INTERNAL_SERVER_ERROR') {
				console.error(error)
			}
		},
	})
})

const PORT = env.PORT

await new Promise<void>((resolve) => app.listen(PORT, resolve))

console.log('Server started.')
console.log(`  > Node: ${chalk.cyanBright.bold(process.version)}`)
console.log(`  > Port: ${chalk.cyanBright.bold(PORT)}`)
console.log(`  > Link: ${chalk.cyanBright.bold(`http://localhost:${PORT}`)}`)
console.log('')
