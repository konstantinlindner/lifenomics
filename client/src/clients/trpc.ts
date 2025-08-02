import { env } from '~/env'

import type { AppRouter } from '@server/trpc'

import { QueryClient } from '@tanstack/react-query'
import {
	TRPCClientError,
	createTRPCClient,
	httpBatchLink,
	loggerLink,
} from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error) => {
				if (
					isTRPCClientError(error) &&
					error.data?.code === 'UNAUTHORIZED'
				) {
					return false
				}

				return failureCount < 3
			},
		},
	},
})

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		loggerLink(),
		httpBatchLink({
			url: `${env.VITE_BACKEND_CONNECTION_STRING}/_`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				} as RequestInit)
			},
		}),
	],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
})

export function isTRPCClientError(
	cause: unknown,
): cause is TRPCClientError<AppRouter> {
	return cause instanceof TRPCClientError
}
