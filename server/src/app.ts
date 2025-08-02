import { App } from '@tinyhttp/app'
import { cookieParser } from '@tinyhttp/cookie-parser'
import { cors } from '@tinyhttp/cors'
import { logger } from '@tinyhttp/logger'
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http'
import chalk from 'chalk'

import { env } from './env'
import { appRouter } from './trpc/appRouter'
import { createContext } from './trpc/context'

const app = new App({
	settings: { xPoweredBy: false },
	onError(error, _, res) {
		console.error(error)
		res.status(500).send('Internal server error')
	},
})

app.use(
	cors({
		origin: env.FRONTEND_URL,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		exposedHeaders: ['Access-Control-Allow-Credentials'],
	}),
)
app.use(cookieParser())

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
