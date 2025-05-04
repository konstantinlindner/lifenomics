import { Table } from '@tanstack/react-table'

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

type PaginationProps<TData> = {
	table: Table<TData>
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
	return (
		<div className='my-4 flex items-center justify-between'>
			<div className='flex items-center space-x-2 lg:space-x-8'>
				<div className='flex items-center space-x-2'>
					<p className='text-xs font-medium lg:text-sm'>
						Rows per page
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger className='h-6 w-14 rounded-md lg:h-8 lg:w-[70px]'>
							<SelectValue
								placeholder={
									table.getState().pagination.pageSize
								}
							/>
						</SelectTrigger>
						<SelectContent side='top'>
							{[5, 10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex w-[100px] items-center justify-center text-xs font-medium lg:text-sm'>
					Sida {table.getState().pagination.pageIndex + 1} av{' '}
					{table.getPageCount()}
				</div>
				<div className='flex items-center space-x-2'>
					<Button
						variant='default'
						className='hidden p-0 lg:flex lg:size-8'
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Go to first page</span>
						<ChevronsLeftIcon className='size-4' />
					</Button>
					<Button
						variant='default'
						className='size-6 p-0 lg:size-8'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Go to previous page</span>
						<ChevronLeftIcon className='size-4' />
					</Button>
					<Button
						variant='default'
						className='size-6 p-0 lg:size-8'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Go to next page</span>
						<ChevronRightIcon className='size-4' />
					</Button>
					<Button
						variant='default'
						className='hidden size-8 p-0 lg:flex'
						onClick={() =>
							table.setPageIndex(table.getPageCount() - 1)
						}
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
