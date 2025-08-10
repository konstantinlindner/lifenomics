import type { Column } from '@tanstack/react-table'

import { SearchIcon } from 'lucide-react'

import { Input } from '~/components/ui'

type SearchProps<TData, TValue> = {
	column?: Column<TData, TValue>
}

export function Search<TData, TValue>({ column }: SearchProps<TData, TValue>) {
	return (
		<div className='flex h-9 items-center justify-center gap-2'>
			<SearchIcon />
			<Input
				type='search'
				placeholder='Search...'
				className='md:w-[150px] lg:w-[300px]'
				disabled={!column}
				value={(column?.getFilterValue() as string | undefined) ?? ''}
				onChange={(event) => column?.setFilterValue(event.target.value)}
			/>
		</div>
	)
}
