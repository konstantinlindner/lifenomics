import type { ComponentProps } from 'react'

import { cn } from '~/helpers'
import { useSidebar } from '~/hooks'

import type { LinkProps } from '@tanstack/react-router'

import {
	BriefcaseBusinessIcon,
	ChartColumnIcon,
	ChartPieIcon,
	DollarSignIcon,
	FactoryIcon,
	GlobeIcon,
	HandCoinsIcon,
	type LucideIcon,
	PercentIcon,
	ScrollIcon,
} from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '~/components/ui'

import { SignOutButton } from '~/components'

import { ItemGroups } from './item-groups'
import { LogoItem } from './logo-item'
import { UserItem } from './user-item'

export type NavItem = {
	title: string
	url: LinkProps['to']
	icon: LucideIcon
	children?: {
		title: string
		url: LinkProps['to']
	}[]
}

const data = {
	'My portfolio': [
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
			url: '/my-assets',
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
			title: 'Assets',
			url: '/assets',
			icon: ScrollIcon,
		},
		{
			title: 'Exchanges',
			url: '/exchanges',
			icon: GlobeIcon,
		},
		{
			title: 'Currencies',
			url: '/currencies',
			icon: DollarSignIcon,
		},
		{
			title: 'Industries',
			url: '/industries',
			icon: FactoryIcon,
		},
		{
			title: 'Sectors',
			url: '/sectors',
			icon: BriefcaseBusinessIcon,
		},
	],
} satisfies Record<string, NavItem[]>

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const { open } = useSidebar()

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className={cn(open && 'p-8')}>
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
