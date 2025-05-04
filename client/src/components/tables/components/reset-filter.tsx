import { Table } from '@tanstack/react-table'

import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ResetFilterProps<TData> = {
	table: Table<TData>
}

export function ResetFilter<TData>({ table }: ResetFilterProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<>
			{isFiltered && (
				<Button
					variant='ghost'
					onClick={() => table.resetColumnFilters()}
					className='h-8 px-2 lg:px-3'
				>
					Reset
					<XIcon className='ml-2 size-4' />
				</Button>
			)}
		</>
	)
}
