import { Link } from '@tanstack/react-router'

import { PlusIcon, ScrollIcon } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	SidebarGroupAction,
} from '~/components/ui'

export function AddEntryDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarGroupAction>
					<PlusIcon />
					<span className='sr-only'>Add entry</span>
				</SidebarGroupAction>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Link to='/stocks' className='flex items-center gap-2'>
						<ScrollIcon className='h-4 w-4' />
						Stocks
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
