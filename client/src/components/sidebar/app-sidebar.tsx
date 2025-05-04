import { ComponentProps } from 'react'

import { cn } from '@/helpers'

import {
	BriefcaseBusinessIcon,
	ChartColumnIcon,
	ChartPieIcon,
	HandCoinsIcon,
	PercentIcon,
	PlusSquareIcon,
	ScrollIcon,
} from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from '@/components/ui/sidebar'

import { AssetDialog, SignOutButton } from '@/components'

import { ItemGroups } from './item-groups'
import { LogoItem } from './logo-item'
import { UserItem } from './user-item'

const data = {
	'My portfolio': [
		{
			title: 'Add asset',
			component: AssetDialog,
			icon: PlusSquareIcon,
		},
		{
			title: 'Home',
			url: '/',
			icon: ChartColumnIcon,
		},
		{
			title: 'Portfolios',
			url: '/portfolios',
			icon: ChartPieIcon,
		},
		{
			title: 'Assets',
			url: '/assets',
			icon: ScrollIcon,
		},
		{
			title: 'Transactions',
			url: '/transactions',
			icon: HandCoinsIcon,
		},
		{
			title: 'Dividends',
			url: '/dividends',
			icon: PercentIcon,
		},
	],
	Explore: [
		{
			title: 'Companies',
			url: '/companies',
			icon: BriefcaseBusinessIcon,
		},
	],
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const { open } = useSidebar()

	return (
		<Sidebar collapsible='icon' {...props} className='px-2 py-4'>
			<SidebarHeader>
				<LogoItem />
			</SidebarHeader>
			<SidebarContent>
				<ItemGroups items={data} />
			</SidebarContent>
			<SidebarFooter>
				<UserItem />
				<SignOutButton
					className={cn('h-8', !open && 'bg-transparent')}
					showText={open}
				/>
			</SidebarFooter>
			<SidebarRail className='bg-none' />
		</Sidebar>
	)
}
