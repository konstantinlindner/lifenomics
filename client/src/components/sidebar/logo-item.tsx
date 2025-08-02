import { Link } from '@tanstack/react-router'

import { SidebarMenu } from '~/components/ui'

import { Logo } from '~/components'

export function LogoItem() {
	return (
		<SidebarMenu>
			<Link to={'/'} className='flex items-center justify-center'>
				<Logo />
			</Link>
		</SidebarMenu>
	)
}
