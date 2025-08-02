import { trpc } from '~/clients'

import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { AssetTable, ErrorItem, LoadingIndicator } from '~/components'

export const Route = createFileRoute('/_app/portfolios/$portfolioId')({
	component: Portfolio,
})

function Portfolio() {
	const { portfolioId } = Route.useParams()

	const {
		data: portfolio,
		isPending,
		isError,
		error,
	} = useQuery(trpc.portfolio.getById.queryOptions(Number(portfolioId)))

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

	if (!portfolio) {
		return <ErrorItem error={new Error('Portfolio not found')} />
	}

	return (
		<main className='mr-10 mt-20 w-screen'>
			<p>{portfolio.name}</p>

			<AssetTable />
		</main>
	)
}
