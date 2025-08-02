import type { ReactElement } from 'react'

import { queryClient } from '~/clients'
import { ThemeProvider, UserProvider } from '~/providers'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type Register, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface AppProps {
	router: Register['router']
}

const App = ({ router }: AppProps): ReactElement => {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
					<RouterProvider router={router} />
					<TanStackRouterDevtools router={router} />
					<ReactQueryDevtools initialIsOpen={false} />
				</ThemeProvider>
			</UserProvider>
		</QueryClientProvider>
	)
}

export default App
