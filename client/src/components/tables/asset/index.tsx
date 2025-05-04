import { getAssets } from '@/fetch'

import { useQuery } from '@tanstack/react-query'

import { ErrorItem } from '@/components'

import { columns } from './columns'
import { DataTable } from './data-table'

type AssetTableProps = {
	portfolioId?: number
}

export function AssetTable({ portfolioId }: AssetTableProps) {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['getAssets', portfolioId],
		queryFn: () => getAssets(portfolioId),
	})

	if (isPending) {
		return null
	}

	if (isError) {
		return <ErrorItem error={error} />
	}

	return <DataTable columns={columns} data={data} />
}
