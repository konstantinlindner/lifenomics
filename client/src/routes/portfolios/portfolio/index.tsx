import { getPortfolioById } from '@/fetch'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { AssetTable, ErrorItem, LoadingIndicator } from '@/components'

export function Portfolio() {
	const params = useParams()

	const portfolioIdString = params.portfolioId
	const portfolioId = Number(portfolioIdString)

	const {
		data: portfolio,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['portfolio', portfolioId],
		queryFn: () => getPortfolioById(portfolioId),
	})

	if (isPending) {
		return (
			<div className='flex min-h-screen w-full items-center justify-center'>
				<LoadingIndicator size='lg' />
			</div>
		)
	}

	if (isError) {
		return <ErrorItem error={error} />
	}

	return (
		<main className='mr-10 mt-20 w-screen'>
			<p>{portfolio.name}</p>

			<AssetTable portfolioId={portfolioId} />
		</main>
	)
}
