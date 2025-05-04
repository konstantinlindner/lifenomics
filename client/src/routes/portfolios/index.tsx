import { getPortfolios } from '@/fetch'

import { useQuery } from '@tanstack/react-query'

import { PortfolioDialog } from '@/components'

import { PortfolioCard } from './portfolio-card'

export function Portfolios() {
	const { data: portfolios } = useQuery({
		queryKey: ['getPortfolios'],
		queryFn: () => getPortfolios(),
	})

	return (
		<main className='mr-10 mt-20 w-screen'>
			<PortfolioDialog />
			<div className='flex flex-wrap gap-4'>
				{portfolios?.map((portfolio) => (
					<PortfolioCard key={portfolio.id} portfolio={portfolio} />
				))}
			</div>
		</main>
	)
}
