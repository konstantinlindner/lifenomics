import { S3 } from '@aws-sdk/client-s3'
import { env } from 'src/env'

const accessKeyId = env.AWS_ACCESS_KEY_ID
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY

export const s3 = new S3({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
})
