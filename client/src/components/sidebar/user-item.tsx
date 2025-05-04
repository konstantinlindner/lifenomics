import { useUser } from '@/contexts'

import { Link } from 'react-router-dom'

import { ChevronRightIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

export function UserItem() {
	const { user } = useUser()

	if (!user) {
		return
	}

	const fullName = `${user.firstName} ${user.lastName}`
	const displayName = fullName.length > 20 ? user.firstName : fullName

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Link to={'profile'}>
					<SidebarMenuButton
						size='lg'
						className='data-[state=open]:bg-sidebar-primary data-[state=open]:text-sidebar-accent-foreground w-full'
					>
						<Avatar className='h-8 w-8 rounded-md'>
							<AvatarImage
								src={user.avatarUrl ?? undefined}
								alt={`${user.firstName} ${user.lastName}`}
							/>
							<AvatarFallback className='rounded-lg'>
								{`${user.firstName[0]}${user.lastName[0]}`}
							</AvatarFallback>
						</Avatar>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate text-xs opacity-70'>
								User
							</span>
							<span className='truncate font-semibold'>
								{displayName}
							</span>
						</div>
						<ChevronRightIcon className='ml-auto size-4' />
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
