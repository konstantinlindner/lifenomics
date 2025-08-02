import { trpc } from '~/clients'

import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { PortfolioDialog } from '~/components'
import { PortfolioCard } from '~/components/portfolio-card'

export const Route = createFileRoute('/_app/portfolios')({
	component: Portfolios,
})

function Portfolios() {
	const { data: portfolios } = useQuery(trpc.portfolio.getAll.queryOptions())

	return (
		<main>
			<PortfolioDialog />
			<div className='flex flex-wrap gap-4'>
				{portfolios?.map((portfolio) => (
					<PortfolioCard key={portfolio.id} portfolio={portfolio} />
				))}
			</div>
		</main>
	)
}
