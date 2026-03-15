import type { Table } from '@tanstack/react-table'

import { FilterPopover } from './filter-popover'

const filterOptions = [
	{ name: 'ticker', title: 'Ticker' },
	{ name: 'companyName', title: 'Company' },
	{ name: 'exchangeName', title: 'Exchange' },
	{ name: 'name', title: 'Name' },
	{ name: 'country', title: 'Country' },
	{ name: 'transactionType', title: 'Type' },
] as const

type FilterOptionNames = (typeof filterOptions)[number]['name']

type FilterProps<TData> = {
	table: Table<TData>
	filter: FilterOptionNames
}

export function Filter<TData>({ table, filter }: FilterProps<TData>) {
	const filterOption = filterOptions.find((option) => option.name === filter)
	if (!filterOption) {
		return null
	}
	const column = table.getColumn(filterOption.name)
	const facets = column?.getFacetedUniqueValues()
	const uniqueValues: string[] | undefined = Array.from(facets?.keys() ?? [])
	const selectedValues = new Set(column?.getFilterValue() as string[])

	const handleSelect = (value: string) => {
		const next = new Set(selectedValues)
		if (next.has(value)) {
			next.delete(value)
		} else {
			next.add(value)
		}
		const filterValues = Array.from(next)
		column?.setFilterValue(filterValues.length ? filterValues : undefined)
	}

	const handleReset = () => {
		column?.setFilterValue(undefined)
	}

	return (
		<FilterPopover
			title={filterOption.title}
			uniqueValues={uniqueValues}
			selectedValues={selectedValues}
			onSelect={handleSelect}
			onReset={handleReset}
			facets={facets}
		/>
	)
}
