import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { env } from './env'
import { createContext } from './trpc/context'
import { appRouter } from './trpc/routers/appRouter'

// todo create env variable for frontend url

const app = express()
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(
	'/trpc',
	createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
)

const port = env.PORT

app.listen(port, () => {
	// TODO: change eslint rule to not apply to server directory
	// eslint-disable-next-line no-console
	console.log(`[server]: Express server running on PORT ${port}`)
})
