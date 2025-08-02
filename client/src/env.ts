import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	clientPrefix: 'VITE_',
	client: {
		VITE_BACKEND_CONNECTION_STRING: z
			.string()
			.url()
			.refine(
				(string) => !string.includes('YOUR_BACKEND_CONNECTION_STRING'),
				'You forgot to change the default backend connection string',
			),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
})
