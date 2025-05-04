import { Link } from 'react-router-dom'

import { SidebarMenu, useSidebar } from '@/components/ui/sidebar'

import { Logo } from '@/components'

export function LogoItem() {
	const { open } = useSidebar()

	return (
		<SidebarMenu>
			<Link
				to={'/'}
				className='mb-4 flex h-8 items-center justify-center'
			>
				{open ?
					<Logo />
				:	<Logo hideText />}
			</Link>
		</SidebarMenu>
	)
}
