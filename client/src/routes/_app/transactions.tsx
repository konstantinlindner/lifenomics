import { createFileRoute } from '@tanstack/react-router'

import { TransactionTable } from '~/components'

export const Route = createFileRoute('/_app/transactions')({
	component: Transactions,
})

function Transactions() {
	return (
		<main>
			<TransactionTable />
		</main>
	)
}
