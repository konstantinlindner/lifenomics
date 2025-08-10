import type { Table } from '@tanstack/react-table'

import { XIcon } from 'lucide-react'

import { Button } from '~/components/ui'

type ResetFilterProps<TData> = {
	table: Table<TData>
}

export function ResetFilter<TData>({ table }: ResetFilterProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<>
			{isFiltered && (
				<Button
					variant='outline'
					size='icon'
					onClick={() => {
						table.resetColumnFilters()
					}}
				>
					Reset
					<XIcon className='ml-2 size-4' />
				</Button>
			)}
		</>
	)
}
