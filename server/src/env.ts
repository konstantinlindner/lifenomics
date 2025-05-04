import { createEnv } from '@t3-oss/env-core'
import { config } from 'dotenv'
import { z } from 'zod'

// load env variables from .env file
config()

export const env = createEnv({
	server: {
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
