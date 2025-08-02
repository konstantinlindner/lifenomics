import type { PortfolioRouterOutput } from '@server/trpc/routers/portfolio'

import { Link } from '@tanstack/react-router'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui'

import { PortfolioDialog } from '~/components'

type PortfolioCardProps = {
	portfolio: NonNullable<PortfolioRouterOutput['getById']>
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
	return (
		<Link
			to='/portfolios/$portfolioId'
			params={{ portfolioId: portfolio.id.toString() }}
		>
			<Card className='w-72'>
				<CardHeader className='flex flex-row justify-between'>
					<CardTitle>{portfolio.name}</CardTitle>
					<PortfolioDialog portfolioId={portfolio.id} />
				</CardHeader>
				<CardContent>
					<CardDescription>{portfolio.comment}</CardDescription>
				</CardContent>
			</Card>
		</Link>
	)
}
