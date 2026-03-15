import { useEffect, useState } from 'react'

import { trpc } from '~/clients'

import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'

import { SearchIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'

import { ErrorItem } from '~/components'

export const Route = createFileRoute('/_app/stocks/')({
	component: StocksIndex,
})

const DEBOUNCE_MS = 300

function useDebouncedValue<T>(value: T, delayMs: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value)
		}, delayMs)
		return () => {
			clearTimeout(timer)
		}
	}, [value, delayMs])
	return debouncedValue
}

function StockSymbolLink({
	symbol,
	displayName,
	subtitle,
}: {
	symbol: string
	displayName: string
	subtitle?: string
}) {
	return (
		<Link
			to='/stocks/$symbol'
			params={{ symbol }}
			className='flex flex-col rounded-md border p-3 transition-colors hover:bg-muted/50'
		>
			<span className='font-medium'>{displayName}</span>
			{subtitle != null && subtitle !== displayName && (
				<span className='text-sm text-muted-foreground'>
					{subtitle}
				</span>
			)}
		</Link>
	)
}

function StocksIndex() {
	const [searchQuery, setSearchQuery] = useState('')
	const debouncedQuery = useDebouncedValue(searchQuery, DEBOUNCE_MS)

	const positionsQuery = useQuery(trpc.portfolio.getPositions.queryOptions())
	const starredQuery = useQuery(trpc.watchlist.getStarred.queryOptions())
	const searchQueryResult = useQuery({
		...trpc.stock.search.queryOptions({ q: debouncedQuery }),
		enabled: debouncedQuery.length >= 2,
	})

	const positions = positionsQuery.data ?? []
	const starredSymbols = starredQuery.data ?? []
	const searchResults = searchQueryResult.data ?? []

	const showSearchResults = debouncedQuery.length >= 2

	if (positionsQuery.isError) {
		return <ErrorItem error={positionsQuery.error} />
	}
	if (starredQuery.isError) {
		return <ErrorItem error={starredQuery.error} />
	}

	return (
		<main className='space-y-6'>
			<div className='flex items-center gap-2'>
				<div className='relative flex-1'>
					<SearchIcon className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search stocks by symbol or name…'
						className='pl-9'
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
						}}
					/>
				</div>
			</div>

			{showSearchResults && (
				<Card>
					<CardHeader>
						<CardTitle>Search results</CardTitle>
					</CardHeader>
					<CardContent>
						{searchQueryResult.isPending ?
							<p className='text-sm text-muted-foreground'>
								Searching…
							</p>
						: searchResults.length === 0 ?
							<p className='text-sm text-muted-foreground'>
								No results for &quot;{debouncedQuery}&quot;
							</p>
						:	<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
								{searchResults.slice(0, 24).map((item) => (
									<StockSymbolLink
										key={item.symbol}
										symbol={item.symbol}
										displayName={
											item.displaySymbol || item.symbol
										}
										subtitle={item.description || undefined}
									/>
								))}
							</div>
						}
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Your portfolio</CardTitle>
					<p className='text-sm text-muted-foreground'>
						Positions you’ve added. Add more from a stock’s page.
					</p>
				</CardHeader>
				<CardContent>
					{positionsQuery.isPending ?
						<p className='text-sm text-muted-foreground'>
							Loading…
						</p>
					: positions.length === 0 ?
						<p className='text-sm text-muted-foreground'>
							No positions yet. Search for a stock and add it to
							your portfolio.
						</p>
					:	<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
							{positions.map((pos) => (
								<Link
									key={pos.id}
									to='/stocks/$symbol'
									params={{ symbol: pos.symbol }}
									className='flex flex-col rounded-md border p-3 transition-colors hover:bg-muted/50'
								>
									<span className='font-medium'>
										{pos.symbol}
									</span>
									<span className='text-sm text-muted-foreground'>
										{pos.quantity} @{' '}
										{pos.averagePurchasePrice}{' '}
										{pos.currency}
										{pos.changePercentSinceBought
											!= null && (
											<span
												className={
													(
														pos.changePercentSinceBought
														>= 0
													) ?
														'text-green-600'
													:	'text-red-600'
												}
											>
												{' '}
												(
												{(
													pos.changePercentSinceBought
													>= 0
												) ?
													'+'
												:	''}
												{pos.changePercentSinceBought.toFixed(
													1,
												)}
												%)
											</span>
										)}
									</span>
								</Link>
							))}
						</div>
					}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Starred</CardTitle>
					<p className='text-sm text-muted-foreground'>
						Stocks you’re following.
					</p>
				</CardHeader>
				<CardContent>
					{starredQuery.isPending ?
						<p className='text-sm text-muted-foreground'>
							Loading…
						</p>
					: starredSymbols.length === 0 ?
						<p className='text-sm text-muted-foreground'>
							No starred stocks. Open a stock and tap the star to
							add it here.
						</p>
					:	<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
							{starredSymbols.map((item) => (
								<StockSymbolLink
									key={item.symbol}
									symbol={item.symbol}
									displayName={item.symbol}
								/>
							))}
						</div>
					}
				</CardContent>
			</Card>
		</main>
	)
}
