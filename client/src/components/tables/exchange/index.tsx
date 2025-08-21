import { trpc } from '~/clients'

import { useQuery } from '@tanstack/react-query'

import { ErrorItem } from '~/components'

import { columns } from './columns'
import { DataTable } from './data-table'

export function ExchangeTable() {
	const {
		data: exchanges,
		isPending,
		isError,
		error,
	} = useQuery(trpc.exchange.get.queryOptions())

	if (isPending) {
		return null
	}

	if (isError) {
		return <ErrorItem error={error} />
	}

	return <DataTable columns={columns} data={exchanges} />
}
