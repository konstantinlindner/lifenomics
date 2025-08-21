import { createFileRoute } from '@tanstack/react-router'

import { ExchangeTable } from '~/components'

export const Route = createFileRoute('/_app/exchanges')({
	component: Exchanges,
})

function Exchanges() {
	return (
		<main>
			<ExchangeTable />
		</main>
	)
}
