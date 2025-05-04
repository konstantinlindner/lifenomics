import { getTransactions } from '@/fetch'

import { useQuery } from '@tanstack/react-query'

import { ErrorItem } from '@/components'

import { columns } from './columns'
import { DataTable } from './data-table'

export function TransactionTable() {
	const {
		data: transactions,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['getTransactions'],
		queryFn: () => getTransactions(),
	})

	if (isPending) {
		return null
	}

	if (isError) {
		return <ErrorItem error={error} />
	}

	return <DataTable columns={columns} data={transactions} />
}
