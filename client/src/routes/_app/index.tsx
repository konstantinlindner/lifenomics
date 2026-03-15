import type { StockRouterOutput } from '@server/trpc/routers/stock'

import { trpc } from '~/clients'

import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import { ErrorItem } from '~/components'

export const Route = createFileRoute('/_app/')({
	component: Index,
})

type MoverItem = StockRouterOutput['getTopMovers']['gainers'][number]

function MoverRow({
	item,
	variant,
}: {
	item: MoverItem
	variant: 'gainer' | 'loser'
}) {
	const isPositive = item.changePercent >= 0
	const percentClass =
		variant === 'gainer' ? 'text-green-600' : 'text-red-600'
	return (
		<div className='flex items-center justify-between border-b py-3 last:border-0'>
			<div className='flex flex-col'>
				<span className='font-medium'>{item.ticker}</span>
				<span className='text-sm text-muted-foreground'>
					{item.companyName}
				</span>
			</div>
			<div className='flex flex-col text-right'>
				<span>{item.current.toFixed(2)}</span>
				<span className={percentClass}>
					{isPositive ? '+' : ''}
					{item.changePercent.toFixed(2)}%
				</span>
			</div>
		</div>
	)
}

const NEWS_LIMIT = 10

function Index() {
	const moversQuery = useQuery(
		trpc.stock.getTopMovers.queryOptions({ limit: 10 }),
	)
	const marketNewsQuery = useQuery(
		trpc.stock.getMarketNews.queryOptions({ category: 'general' }),
	)

	const isPending = moversQuery.isPending
	const isError = moversQuery.isError
	const error = moversQuery.error
	const data = moversQuery.data

	if (isPending) {
		return (
			<main className='flex min-h-[200px] items-center justify-center'>
				<p className='text-muted-foreground'>Loading movers…</p>
			</main>
		)
	}

	if (isError) {
		return <ErrorItem error={error ?? new Error('Something went wrong')} />
	}

	if (!data) {
		return null
	}

	return (
		<main className='space-y-6'>
			<div className='grid gap-6 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Biggest gainers today</CardTitle>
					</CardHeader>
					<CardContent>
						{data.gainers.length === 0 ?
							<p className='text-sm text-muted-foreground'>
								No gainers with quote data.
							</p>
						:	<div className='divide-y'>
								{data.gainers.map((item) => (
									<MoverRow
										key={item.ticker}
										item={item}
										variant='gainer'
									/>
								))}
							</div>
						}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Biggest losers today</CardTitle>
					</CardHeader>
					<CardContent>
						{data.losers.length === 0 ?
							<p className='text-sm text-muted-foreground'>
								No losers with quote data.
							</p>
						:	<div className='divide-y'>
								{data.losers.map((item) => (
									<MoverRow
										key={item.ticker}
										item={item}
										variant='loser'
									/>
								))}
							</div>
						}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Market news</CardTitle>
				</CardHeader>
				<CardContent>
					{marketNewsQuery.isPending && (
						<p className='text-muted-foreground'>Loading news…</p>
					)}
					{marketNewsQuery.isError && (
						<p className='text-sm text-muted-foreground'>
							Could not load market news.
						</p>
					)}
					{marketNewsQuery.isSuccess && (
						<>
							{marketNewsQuery.data.length === 0 ?
								<p className='text-sm text-muted-foreground'>
									No market news.
								</p>
							:	<ul className='space-y-3'>
									{marketNewsQuery.data
										.slice(0, NEWS_LIMIT)
										.map((item) => (
											<li
												key={item.id || item.headline}
												className='border-b pb-3 last:border-0'
											>
												{item.url ?
													<a
														href={item.url}
														target='_blank'
														rel='noopener noreferrer'
														className='font-medium text-primary underline hover:no-underline'
													>
														{item.headline}
													</a>
												:	<span className='font-medium'>
														{item.headline}
													</span>
												}
												<div className='mt-1 text-sm text-muted-foreground'>
													{item.source && (
														<span>
															{item.source}
														</span>
													)}
													{item.datetime ?
														<span>
															{item.source ?
																' · '
															:	''}
															{dayjs
																.unix(
																	item.datetime,
																)
																.format(
																	'MMM D, YYYY',
																)}
														</span>
													:	null}
												</div>
											</li>
										))}
								</ul>
							}
						</>
					)}
				</CardContent>
			</Card>
		</main>
	)
}
