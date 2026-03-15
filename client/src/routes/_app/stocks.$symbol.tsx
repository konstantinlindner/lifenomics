import { useState } from 'react'

import { trpc } from '~/clients'

import {
	useMutation,
	useQueries,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { StarIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '~/components/ui/chart'

import { ErrorItem } from '~/components'
import { AddPositionDialog } from '~/components/dialogs/add-position-dialog'

const STALE_TIME_MS = 2 * 60 * 1000 // 2 minutes

export const Route = createFileRoute('/_app/stocks/$symbol')({
	component: StockDetailBySymbolPage,
})

function StockDetailBySymbolPage() {
	const { symbol: rawSymbol } = Route.useParams()
	const symbol = decodeURIComponent(rawSymbol)

	const [addPositionOpen, setAddPositionOpen] = useState(false)
	const queryClient = useQueryClient()

	const profileQuery = useQuery({
		...trpc.stock.getCompanyProfile.queryOptions({ symbol }),
		enabled: symbol.length > 0,
		staleTime: STALE_TIME_MS,
	})
	const positionQuery = useQuery({
		...trpc.portfolio.getPositionBySymbol.queryOptions({ symbol }),
		enabled: symbol.length > 0,
	})
	const isStarredQuery = useQuery({
		...trpc.watchlist.isStarred.queryOptions({ symbol }),
		enabled: symbol.length > 0,
	})

	const thirtyDaysAgo = Math.floor(dayjs().subtract(30, 'day').unix())
	const now = Math.floor(dayjs().unix())
	const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
	const today = dayjs().format('YYYY-MM-DD')

	const [quoteQuery, candlesQuery, trendsQuery, priceTargetQuery, newsQuery] =
		useQueries({
			queries: [
				{
					...trpc.stock.getQuote.queryOptions({ symbol }),
					enabled: symbol.length > 0,
					staleTime: STALE_TIME_MS,
				},
				{
					...trpc.stock.getCandles.queryOptions({
						symbol,
						resolution: 'D',
						from: thirtyDaysAgo,
						to: now,
					}),
					enabled: symbol.length > 0,
					staleTime: STALE_TIME_MS,
				},
				{
					...trpc.stock.getRecommendationTrends.queryOptions({
						symbol,
					}),
					enabled: symbol.length > 0,
					staleTime: STALE_TIME_MS,
				},
				{
					...trpc.stock.getPriceTarget.queryOptions({ symbol }),
					enabled: symbol.length > 0,
					staleTime: STALE_TIME_MS,
				},
				{
					...trpc.stock.getCompanyNews.queryOptions({
						symbol,
						from: sevenDaysAgo,
						to: today,
					}),
					enabled: symbol.length > 0,
					staleTime: STALE_TIME_MS,
				},
			],
		})

	const toggleStarred = useMutation(
		trpc.watchlist.toggleStarred.mutationOptions(),
	)

	const profile = profileQuery.data
	const quote = quoteQuery.data
	const position = positionQuery.data
	const candlesResult = candlesQuery.data
	const trends = trendsQuery.data ?? []
	const priceTarget = priceTargetQuery.data
	const news = newsQuery.data ?? []
	const isStarred = isStarredQuery.data ?? false

	const hasValidSymbol =
		symbol.length > 0 && (profile != null || quote != null)
	const isLoading =
		(profileQuery.isPending || quoteQuery.isPending) && symbol.length > 0

	if (symbol.length === 0) {
		return (
			<main className='space-y-6'>
				<p className='text-muted-foreground'>Invalid symbol.</p>
				<Link to='/stocks' className='text-primary underline'>
					Back to stocks
				</Link>
			</main>
		)
	}

	if (profileQuery.isError) {
		return <ErrorItem error={profileQuery.error} />
	}
	if (quoteQuery.isError) {
		return <ErrorItem error={quoteQuery.error} />
	}

	if (isLoading) {
		return (
			<main className='flex min-h-[200px] items-center justify-center'>
				<p className='text-muted-foreground'>Loading…</p>
			</main>
		)
	}

	if (!hasValidSymbol) {
		return (
			<main className='space-y-6'>
				<p className='text-muted-foreground'>
					No data found for &quot;{symbol}&quot;.
				</p>
				<Link to='/stocks' className='text-primary underline'>
					Back to stocks
				</Link>
			</main>
		)
	}

	const chartData =
		candlesResult?.candles.map((c) => ({
			date: dayjs.unix(c.timestamp).format('MMM D'),
			close: c.close,
		})) ?? []
	const latestTrend = trends.length > 0 ? trends[trends.length - 1] : null
	const displayName = profile?.name ?? symbol
	const currency = profile?.exchange ? 'USD' : 'USD'

	function handleToggleStarred() {
		toggleStarred.mutate(
			{ symbol },
			{
				onSuccess: () => {
					void queryClient.invalidateQueries({
						queryKey: trpc.watchlist.getStarred.queryKey(),
					})
					void queryClient.invalidateQueries({
						queryKey: trpc.watchlist.isStarred.queryKey({
							symbol,
						}),
					})
				},
			},
		)
	}

	return (
		<main className='space-y-6'>
			{/* Header */}
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div className='flex flex-wrap items-center gap-4'>
					{profile?.logo && (
						<img
							src={profile.logo}
							alt=''
							className='h-12 w-12 rounded object-contain'
						/>
					)}
					<div>
						<h1 className='text-2xl font-semibold'>
							{displayName}
						</h1>
						<p className='text-muted-foreground'>{symbol}</p>
					</div>
					{profile?.webUrl && (
						<a
							href={profile.webUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary underline'
						>
							Visit website
						</a>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant={isStarred ? 'secondary' : 'outline'}
						size='icon'
						onClick={handleToggleStarred}
						disabled={toggleStarred.isPending}
						aria-label={isStarred ? 'Unstar' : 'Star'}
					>
						<StarIcon
							className={isStarred ? 'fill-current' : undefined}
						/>
					</Button>
					<Button
						variant='outline'
						onClick={() => {
							setAddPositionOpen(true)
						}}
					>
						{position ? 'Edit position' : 'Add to portfolio'}
					</Button>
				</div>
			</div>

			<AddPositionDialog
				symbol={symbol}
				currency={currency}
				open={addPositionOpen}
				onOpenChange={setAddPositionOpen}
				existingPosition={
					position ?
						{
							id: position.id,
							quantity: position.quantity,
							averagePurchasePrice: position.averagePurchasePrice,
							currency: position.currency,
						}
					:	null
				}
			/>

			{/* Position card */}
			{position && quote && (
				<Card>
					<CardHeader>
						<CardTitle>Your position</CardTitle>
					</CardHeader>
					<CardContent className='space-y-2'>
						<p>
							{position.quantity} @{' '}
							{position.averagePurchasePrice} {position.currency}{' '}
							avg
						</p>
						<p>
							Current: <strong>{quote.current.toFixed(2)}</strong>{' '}
							{position.currency}
						</p>
						{(() => {
							const avg = position.averagePurchasePrice
							const change =
								avg > 0 ?
									((quote.current - avg) / avg) * 100
								:	null
							if (change == null) return null
							const isPositive = change >= 0
							return (
								<p
									className={
										isPositive ? 'text-green-600' : (
											'text-red-600'
										)
									}
								>
									{isPositive ? '+' : ''}
									{change.toFixed(2)}% since purchase
								</p>
							)
						})()}
					</CardContent>
				</Card>
			)}

			{/* Quote */}
			<Card>
				<CardHeader>
					<CardTitle>Current price</CardTitle>
				</CardHeader>
				<CardContent>
					{quote ?
						<div className='flex flex-col'>
							<span className='text-2xl font-semibold'>
								{quote.current.toFixed(2)}
							</span>
							<span
								className={
									quote.changePercent >= 0 ?
										'text-green-600'
									:	'text-red-600'
								}
							>
								{quote.changePercent >= 0 ? '+' : ''}
								{quote.changePercent.toFixed(2)}%
							</span>
						</div>
					:	<p className='text-muted-foreground'>—</p>}
				</CardContent>
			</Card>

			{/* Price chart */}
			<Card>
				<CardHeader>
					<CardTitle>Price (last 30 days)</CardTitle>
				</CardHeader>
				<CardContent>
					{chartData.length > 0 ?
						<ChartContainer
							config={{
								close: {
									label: 'Close',
									color: 'var(--color-chart-1)',
								},
							}}
							className='h-[300px] w-full'
						>
							<AreaChart data={chartData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='date' />
								<YAxis />
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) => [
												Number(value).toFixed(2),
												'Close',
											]}
										/>
									}
								/>
								<Area
									type='monotone'
									dataKey='close'
									stroke='var(--color-chart-1)'
									fill='var(--color-chart-1)'
									fillOpacity={0.3}
								/>
							</AreaChart>
						</ChartContainer>
					:	<p className='text-muted-foreground'>No chart data.</p>}
				</CardContent>
			</Card>

			{/* Price target */}
			{priceTarget
				&& (priceTarget.targetMean != null
					|| priceTarget.targetMedian != null) && (
					<Card>
						<CardHeader>
							<CardTitle>Analyst price target</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							{priceTarget.targetMean != null && (
								<p>
									Mean:{' '}
									<strong>
										{priceTarget.targetMean.toFixed(2)}
									</strong>
								</p>
							)}
							{priceTarget.targetMedian != null && (
								<p>
									Median:{' '}
									<strong>
										{priceTarget.targetMedian.toFixed(2)}
									</strong>
								</p>
							)}
							{quote && priceTarget.targetMean != null && (
								<p className='text-sm text-muted-foreground'>
									Upside:{' '}
									{(
										((priceTarget.targetMean
											- quote.current)
											/ quote.current)
										* 100
									).toFixed(1)}
									%
								</p>
							)}
						</CardContent>
					</Card>
				)}

			{/* Recommendation trends */}
			<Card>
				<CardHeader>
					<CardTitle>Analyst recommendations</CardTitle>
				</CardHeader>
				<CardContent>
					{latestTrend ?
						<div className='flex flex-wrap gap-4'>
							<span>Strong buy: {latestTrend.strongBuy}</span>
							<span>Buy: {latestTrend.buy}</span>
							<span>Hold: {latestTrend.hold}</span>
							<span>Sell: {latestTrend.sell}</span>
							<span>Strong sell: {latestTrend.strongSell}</span>
							{latestTrend.period && (
								<span className='text-sm text-muted-foreground'>
									({latestTrend.period})
								</span>
							)}
						</div>
					:	<p className='text-muted-foreground'>
							No recommendation data.
						</p>
					}
				</CardContent>
			</Card>

			{/* About */}
			{profile?.description && (
				<Card>
					<CardHeader>
						<CardTitle>About</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='whitespace-pre-wrap text-muted-foreground'>
							{profile.description}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Company news */}
			<Card>
				<CardHeader>
					<CardTitle>Company news</CardTitle>
				</CardHeader>
				<CardContent>
					{news.length === 0 ?
						<p className='text-muted-foreground'>No news.</p>
					:	<ul className='space-y-3'>
							{news.slice(0, 10).map((item) => (
								<li
									key={item.id}
									className='border-b pb-3 last:border-0'
								>
									{item.url ?
										<a
											href={item.url}
											target='_blank'
											rel='noopener noreferrer'
											className='font-medium text-primary underline'
										>
											{item.headline}
										</a>
									:	<span className='font-medium'>
											{item.headline}
										</span>
									}
									<div className='mt-1 text-sm text-muted-foreground'>
										{item.source && (
											<span>{item.source}</span>
										)}
										{item.datetime && (
											<span>
												{item.source ? ' · ' : ''}
												{dayjs
													.unix(item.datetime)
													.format('MMM D, YYYY')}
											</span>
										)}
									</div>
								</li>
							))}
						</ul>
					}
				</CardContent>
			</Card>
		</main>
	)
}
