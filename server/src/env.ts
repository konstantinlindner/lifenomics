import { createEnv } from '@t3-oss/env-core'
import 'dotenv/config'
import { z } from 'zod'

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'production']),
		PORT: z.coerce.number().int().min(1).max(65535),
		DATABASE_URL: z.string().url(),
		FRONTEND_URL: z.string().url(),
		JWT_SECRET: z.string().min(1),
		AWS_REGION: z.string().min(1),
		AWS_ACCESS_KEY_ID: z.string().min(1),
		AWS_SECRET_ACCESS_KEY: z.string().min(1),
		AWS_S3_BUCKET_NAME: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
