import type { trpcClient } from '~/clients'

import {
	Outlet,
	createRootRouteWithContext,
	redirect,
} from '@tanstack/react-router'

import { Toaster } from '~/components/ui'

import { NotFound } from '~/components'

export type RouterContext = {
	trpcClient: typeof trpcClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Root,
	notFoundComponent: NotFound,
	beforeLoad: async ({ context, location }) => {
		const routesWithOwnAuthHandling = ['/sign-in', '/sign-up']
		const routeHasOwnAuthHandling = routesWithOwnAuthHandling.includes(
			location.pathname,
		)

		// don't block the page load for routes with own auth handling
		if (routeHasOwnAuthHandling) {
			return
		}

		try {
			await context.trpcClient.user.get.query()
		} catch {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw redirect({
				to: '/sign-in',
			})
		}
	},
})

function Root() {
	return (
		<main className='bg-background flex h-dvh w-dvw'>
			<div className='text-primary bg-background min-h-0 flex-1 overflow-auto'>
				<Outlet />
			</div>
			<Toaster />
		</main>
	)
}
