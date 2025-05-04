import { ReactElement } from 'react'

import { queryClient } from '@/clients'
import { UserProvider } from '@/contexts'

import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

type AppProps = { router: ReturnType<typeof createBrowserRouter> }

const App = ({ router }: AppProps): ReactElement => {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<SidebarProvider>
					<RouterProvider router={router} />
					<Toaster />
				</SidebarProvider>
			</UserProvider>
		</QueryClientProvider>
	)
}

export default App
