import { useState } from 'react'

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'

import { GlobeIcon, ListFilterIcon } from 'lucide-react'

import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui'

import { AssetDialog } from '~/components'

import { Filter } from '../components/filter'
import { Pagination } from '../components/pagination'
import { ResetFilter } from '../components/reset-filter'
import { Search } from '../components/search'
import { ViewOptions } from '../components/view-options'
import { Wrapper } from '../components/wrapper'

type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		timezoneName: false,
		timezoneShortName: false,
	})
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	})

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex items-center justify-between'>
				<div className='flex w-full items-center gap-2'>
					<Search column={table.getColumn('ticker')} />

					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => {
								setIsFilterPanelOpen(!isFilterPanelOpen)
							}}
						>
							<ListFilterIcon />
						</Button>
						<ViewOptions table={table} />
						<ResetFilter table={table} />
					</div>
				</div>
				<AssetDialog type='button' />
			</div>
			{isFilterPanelOpen && (
				<div>
					<div className='flex flex-wrap gap-4'>
						<Filter table={table} filter={'ticker'} />
						<Filter table={table} filter={'portfolioId'} />
					</div>
				</div>
			)}
			<Wrapper icon={<GlobeIcon />} tableName={'Exchanges'}>
				<Table className='border-b border-t'>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className='py-1'
										>
											{header.isPlaceholder ? null : (
												flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
												)
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ?
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && 'selected'
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className='px-6 py-3'
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						:	<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No assets found
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
				<div className='flex items-center gap-12 py-1 pl-6'>
					<Pagination table={table} />
				</div>
			</Wrapper>
		</div>
	)
}
