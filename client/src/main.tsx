import { StrictMode } from 'react'

import App from '~/App.tsx'
import { trpcClient } from '~/clients'
import { routeTree } from '~/routeTree.gen'

import '~/styles/globals.css'

import { createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	context: {
		trpcClient,
	},
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('root')

if (!rootElement) {
	throw new Error('No root element found')
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<App router={router} />
		</StrictMode>,
	)
}
