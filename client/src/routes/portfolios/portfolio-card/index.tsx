import { PortfolioRouterOutput } from '@/server/trpc/routers/portfolioRouter'

import { Link } from 'react-router-dom'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import { PortfolioDialog } from '@/components'

type PortfolioCardProps = {
	portfolio: PortfolioRouterOutput['getById']
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
	return (
		<Link to={`/portfolios/${portfolio.id}`}>
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
