import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components'

export function Root() {
	return (
		<main id='detail' className='flex w-screen'>
			<AppSidebar />
			<Outlet />
		</main>
	)
}
