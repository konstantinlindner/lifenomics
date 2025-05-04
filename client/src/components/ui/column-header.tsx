import { HTMLAttributes } from 'react'

import { cn } from '@/helpers'

import { Column } from '@tanstack/react-table'

import {
	ArrowDownIcon,
	ArrowUpIcon,
	ChevronsUpDownIcon,
	EyeOffIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ColumnHeaderProps<TData, TValue> = HTMLAttributes<HTMLDivElement> & {
	column: Column<TData, TValue>
	title: string
}

export function ColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: ColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='data-[state=open]:bg-accent -ml-3 h-8'
					>
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ?
							<ArrowDownIcon className='ml-2 size-4' />
						: column.getIsSorted() === 'asc' ?
							<ArrowUpIcon className='ml-2 size-4' />
						:	<ChevronsUpDownIcon className='ml-2 size-4' />}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(false)}
					>
						<ArrowUpIcon className='text-muted-foreground/70 mr-2 size-3.5' />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(true)}
					>
						<ArrowDownIcon className='text-muted-foreground/70 mr-2 size-3.5' />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}
					>
						<EyeOffIcon className='text-muted-foreground/70 mr-2 size-3.5' />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
