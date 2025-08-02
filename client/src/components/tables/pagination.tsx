import type { Table } from '@tanstack/react-table'

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from 'lucide-react'

import {
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui'

type PaginationProps<TData> = {
	table: Table<TData>
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
	return (
		<div className='my-4 flex items-center'>
			<div className='flex items-center gap-6'>
				<p className='text-xs font-medium lg:text-sm'>Rows per page</p>
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value))
					}}
				>
					<SelectTrigger>
						<SelectValue
							placeholder={table.getState().pagination.pageSize}
						/>
					</SelectTrigger>
					<SelectContent side='top'>
						{[5, 10, 20, 30, 40, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex items-center justify-center text-xs font-medium lg:text-sm'>
					Page {table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</div>
				<div className='flex items-center space-x-2'>
					<Button
						className='hidden p-0 lg:flex lg:size-7'
						size='sm'
						variant='outline'
						onClick={() => {
							table.setPageIndex(0)
						}}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Go to first page</span>
						<ChevronsLeftIcon className='size-4' />
					</Button>
					<Button
						className='size-6 p-0 lg:size-7'
						size='sm'
						variant='outline'
						onClick={() => {
							table.previousPage()
						}}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Go to previous page</span>
						<ChevronLeftIcon className='size-4' />
					</Button>
					<Button
						className='size-6 p-0 lg:size-7'
						size='sm'
						variant='outline'
						onClick={() => {
							table.nextPage()
						}}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Go to next page</span>
						<ChevronRightIcon className='size-4' />
					</Button>
					<Button
						className='hidden p-0 lg:flex lg:size-7'
						size='sm'
						variant='outline'
						onClick={() => {
							table.setPageIndex(table.getPageCount() - 1)
						}}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Go to last page</span>
						<ChevronsRightIcon className='size-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
