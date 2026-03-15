import { getQuote, getQuotes } from '~/finnhub'
import { getStockCandles } from '~/finnhub-candles'
import {
	getCompanyProfile,
	getPriceTarget,
	getRecommendationTrends,
} from '~/finnhub-company'
import { getCompanyNews, getMarketNews } from '~/finnhub-news'
import { searchSymbols } from '~/finnhub-search'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

const QUOTE_CHUNK_SIZE = 20

const symbolInput = z.object({ symbol: z.string().min(1) })
const symbolsInput = z.object({
	symbols: z.array(z.string().min(1)).max(50),
})
const getTopMoversInput = z
	.object({
		limit: z.number().int().min(1).max(50).optional(),
	})
	.default({ limit: 10 })
const companyNewsInput = z.object({
	symbol: z.string().min(1),
	from: z.string().min(1),
	to: z.string().min(1),
})
const marketNewsInput = z
	.object({
		category: z.enum(['general', 'crypto', 'forex']).optional(),
	})
	.default({ category: 'general' })
const searchInput = z.object({
	q: z.string().min(1).max(100),
})
const candlesInput = z.object({
	symbol: z.string().min(1),
	resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
	from: z.number().int().min(0),
	to: z.number().int().min(0),
})

function chunk<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = []
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size))
	}
	return chunks
}

export const stock = router({
	search: protectedProcedure.input(searchInput).query(async ({ input }) => {
		return await searchSymbols(input.q)
	}),

	getQuote: protectedProcedure.input(symbolInput).query(async ({ input }) => {
		return await getQuote(input.symbol)
	}),

	getQuotes: protectedProcedure
		.input(symbolsInput)
		.query(async ({ input }) => {
			return await getQuotes(input.symbols)
		}),

	getCompanyProfile: protectedProcedure
		.input(symbolInput)
		.query(async ({ input }) => {
			return await getCompanyProfile(input.symbol)
		}),

	getRecommendationTrends: protectedProcedure
		.input(symbolInput)
		.query(async ({ input }) => {
			return await getRecommendationTrends(input.symbol)
		}),

	getPriceTarget: protectedProcedure
		.input(symbolInput)
		.query(async ({ input }) => {
			return await getPriceTarget(input.symbol)
		}),

	getCompanyNews: protectedProcedure
		.input(companyNewsInput)
		.query(async ({ input }) => {
			return await getCompanyNews(input.symbol, input.from, input.to)
		}),

	getMarketNews: protectedProcedure
		.input(marketNewsInput)
		.query(async ({ input }) => {
			return await getMarketNews(input.category)
		}),

	getCandles: protectedProcedure
		.input(candlesInput)
		.query(async ({ input }) => {
			return await getStockCandles(
				input.symbol,
				input.resolution,
				input.from,
				input.to,
			)
		}),

	getTopMovers: protectedProcedure
		.input(getTopMoversInput)
		.query(async ({ input }) => {
			const POPULAR_SYMBOLS = [
				'AAPL',
				'MSFT',
				'GOOGL',
				'AMZN',
				'NVDA',
				'META',
				'TSLA',
				'BRK.B',
				'JPM',
				'V',
				'JNJ',
				'WMT',
				'PG',
				'MA',
				'HD',
				'DIS',
				'BAC',
				'ADBE',
				'XOM',
				'PFE',
			]
			const tickerChunks = chunk(POPULAR_SYMBOLS, QUOTE_CHUNK_SIZE)
			const quotesMap: Record<
				string,
				Awaited<ReturnType<typeof getQuotes>>[string]
			> = {}
			for (const symbols of tickerChunks) {
				const quotes = await getQuotes(symbols)
				for (const [symbol, quote] of Object.entries(quotes)) {
					quotesMap[symbol] = quote
				}
			}

			const withQuotes = POPULAR_SYMBOLS.map((ticker) => {
				const quote = quotesMap[ticker]
				if (!quote) return null
				return {
					ticker,
					companyName: ticker,
					current: quote.current,
					change: quote.change,
					changePercent: quote.changePercent,
				}
			}).filter((item): item is NonNullable<typeof item> => item !== null)

			const sortedByPercent = [...withQuotes].sort(
				(a, b) => b.changePercent - a.changePercent,
			)
			const limit = input.limit ?? 10
			const gainers = sortedByPercent.slice(0, limit)
			const losers = sortedByPercent.slice(-limit).reverse()

			return { gainers, losers }
		}),
})

export type StockRouter = typeof stock
export type StockRouterInput = inferRouterInputs<StockRouter>
export type StockRouterOutput = inferRouterOutputs<StockRouter>
