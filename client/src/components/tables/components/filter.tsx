import { Table } from '@tanstack/react-table'

import { FilterPopover } from './filter-popover'

const filterOptions = [
	{
		name: 'ticker',
		title: 'Ticker',
	},
	{
		name: 'portfolioId',
		title: 'Portfolio',
	},
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
		if (selectedValues.has(value)) {
			selectedValues.delete(value)
		} else {
			selectedValues.add(value)
		}
		const filterValues = Array.from(selectedValues)
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
