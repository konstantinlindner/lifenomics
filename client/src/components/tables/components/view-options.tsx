import type { Table } from '@tanstack/react-table'

import { Settings2Icon } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui'

type ViewOptionsProps<TData> = {
	table: Table<TData>
}

export function ViewOptions<TData>({ table }: ViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size='sm' className='h-8'>
					<Settings2Icon className='mr-2 size-4' />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start' className='w-[200px]'>
				<DropdownMenuLabel>Show columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== 'undefined' &&
							column.getCanHide(),
					)
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className='capitalize'
								checked={column.getIsVisible()}
								onCheckedChange={(value) => {
									column.toggleVisibility(!!value)
								}}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
