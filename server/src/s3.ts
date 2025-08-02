import { env } from '~/env'

import { S3 } from '@aws-sdk/client-s3'

const accessKeyId = env.AWS_ACCESS_KEY_ID
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY

export const s3 = new S3({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
})
