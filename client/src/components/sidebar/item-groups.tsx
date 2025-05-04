import { ComponentType } from 'react'

import { useUser } from '@/contexts'

import { NavLink } from 'react-router-dom'

import { LucideIcon, ShieldUserIcon } from 'lucide-react'

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubItem,
	useSidebar,
} from '@/components/ui/sidebar'

type NavItem = {
	title: string
	url?: string
	component?: ComponentType
	icon: LucideIcon
	children?: {
		title: string
		url: string
	}[]
}

type ItemGroupsProps = Record<string, NavItem[]>
export function ItemGroups({ items }: { items: ItemGroupsProps }) {
	const { user } = useUser()
	const { open } = useSidebar()

	return (
		<>
			{Object.entries(items).map(([sectionName, sectionItems]) => (
				<SidebarGroup key={sectionName}>
					<SidebarGroupLabel>{sectionName}</SidebarGroupLabel>
					<SidebarMenu>
						{sectionItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								{item.url ?
									<NavLink
										to={item.url}
										className='flex items-center'
									>
										{({ isActive }) => (
											<SidebarMenuButton
												isActive={isActive}
											>
												<item.icon />
												{open && (
													<span className='ml-2'>
														{item.title}
													</span>
												)}
											</SidebarMenuButton>
										)}
									</NavLink>
								: item.component ?
									<item.component />
								:	null}

								{item.children?.map((subItem) => (
									<SidebarMenuSubItem key={subItem.title}>
										<NavLink to={subItem.url}>
											{({ isActive }) => (
												<SidebarMenuButton
													isActive={isActive}
												>
													{subItem.title}
												</SidebarMenuButton>
											)}
										</NavLink>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			))}

			{user?.role === 'admin' && (
				<SidebarGroup>
					<SidebarGroupLabel>Admin</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<NavLink to='/admin'>
								<SidebarMenuButton>
									<ShieldUserIcon />
									Admin
								</SidebarMenuButton>
							</NavLink>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			)}
		</>
	)
}
