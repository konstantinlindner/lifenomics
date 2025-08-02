import { PlusIcon } from 'lucide-react'

import {
	Dialog,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	SidebarGroupAction,
} from '~/components/ui'

import { AssetDialog, PortfolioDialog, TransactionDialog } from '~/components'

export function AddEntryDropdown() {
	return (
		// Note: To use the Dialog component from within a Context Menu or Dropdown Menu,
		// you must encase the Context Menu or Dropdown Menu component in the Dialog component.
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarGroupAction>
						<PlusIcon />
						<span className='sr-only'>Add entry</span>
					</SidebarGroupAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<TransactionDialog type='dropdown' />
					<AssetDialog type='dropdown' />
					<PortfolioDialog type='dropdown' />
				</DropdownMenuContent>
			</DropdownMenu>
		</Dialog>
	)
}
