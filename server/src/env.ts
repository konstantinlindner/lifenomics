import { createEnv } from '@t3-oss/env-core'
import 'dotenv/config'
import { z } from 'zod'

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'production']),
		PORT: z.coerce.number().int().min(1).max(65535),
		DATABASE_URL: z.url(),
		FRONTEND_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		RESEND_API_KEY: z.string().min(1),
		BLOB_READ_WRITE_TOKEN: z.string().min(1),
		FINNHUB_API_KEY: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
