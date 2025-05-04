import { env } from '@/env'

import { AppRouter } from '@/server/trpc/routers/appRouter'

import {
	TRPCClientError,
	createTRPCClient,
	httpBatchLink,
	loggerLink,
} from '@trpc/client'

const backendConnectionString = env.VITE_BACKEND_CONNECTION_STRING

export const TRPCClient = createTRPCClient<AppRouter>({
	links: [
		loggerLink(),
		httpBatchLink({
			url: `${backendConnectionString}/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				})
			},
		}),
	],
})

export function isTRPCClientError(
	cause: unknown,
): cause is TRPCClientError<AppRouter> {
	return cause instanceof TRPCClientError
}
