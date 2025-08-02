import { useSidebar, useUser } from '~/hooks'

import { Link } from '@tanstack/react-router'

import { ShieldUserIcon } from 'lucide-react'

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubItem,
} from '~/components/ui'

import { AddEntryDropdown } from './add-entry-dropdown'
import type { NavItem } from './app-sidebar'

type ItemGroupsProps = Record<string, NavItem[]>

export function ItemGroups({ items }: { items: ItemGroupsProps }) {
	const { user } = useUser()
	const { open } = useSidebar()

	return (
		<>
			{Object.entries(items).map(([sectionName, sectionItems], index) => (
				<SidebarGroup key={sectionName}>
					<SidebarGroupLabel>{sectionName}</SidebarGroupLabel>
					{/* + button rendered only on first section */}
					{index === 0 && <AddEntryDropdown />}
					<SidebarMenu>
						{sectionItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<Link
									to={item.url}
									className='flex items-center'
								>
									{({ isActive }: { isActive: boolean }) => (
										<SidebarMenuButton isActive={isActive}>
											<item.icon />
											{open && (
												<span className='ml-2'>
													{item.title}
												</span>
											)}
										</SidebarMenuButton>
									)}
								</Link>

								{item.children?.map((subItem) => (
									<SidebarMenuSubItem key={subItem.title}>
										<Link to={subItem.url}>
											{({
												isActive,
											}: {
												isActive: boolean
											}) => (
												<SidebarMenuButton
													isActive={isActive}
												>
													{subItem.title}
												</SidebarMenuButton>
											)}
										</Link>
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
							<Link to='/admin'>
								<SidebarMenuButton>
									<ShieldUserIcon />
									Admin
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			)}
		</>
	)
}
