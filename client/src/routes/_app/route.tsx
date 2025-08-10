import { SidebarProvider } from '~/providers'

import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SidebarInset, SidebarTrigger } from '~/components/ui'

import { AppSidebar, ProfileDropdown, ThemeToggle } from '~/components'

export const Route = createFileRoute('/_app')({
	component: AppLayoutComponent,
})

function AppLayoutComponent() {
	return (
		<SidebarProvider>
			<AppSidebar variant='inset' />
			<SidebarInset>
				<main className='p-5'>
					<header className='flex items-center justify-between'>
						<SidebarTrigger />
						<div className='flex items-center gap-2'>
							<ThemeToggle />
							<ProfileDropdown />
						</div>
					</header>
					<main className='pt-5'>
						<Outlet />
					</main>
				</main>
			</SidebarInset>
		</SidebarProvider>
	)
}
