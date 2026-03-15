import { env } from './env'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

/**
 * Raw quote response from Finnhub Quote API.
 * @see https://finnhub.io/docs/api/quote
 */
export type FinnhubQuoteRaw = {
	c: number // current price
	d: number // change
	dp: number // percent change
	h: number // high price of the day
	l: number // low price of the day
	o: number // open price of the day
	pc: number // previous close price
	t: number // timestamp (Unix)
}

/**
 * Normalized quote for use in the app (friendly field names).
 */
export type Quote = {
	current: number
	change: number
	changePercent: number
	high: number
	low: number
	open: number
	previousClose: number
	timestamp: number
}

function normalizeQuote(raw: FinnhubQuoteRaw): Quote {
	return {
		current: raw.c,
		change: raw.d,
		changePercent: raw.dp,
		high: raw.h,
		low: raw.l,
		open: raw.o,
		previousClose: raw.pc,
		timestamp: raw.t,
	}
}

/**
 * Fetches the current quote for a symbol from Finnhub.
 * @param symbol - Stock symbol (e.g. ticker like AAPL, or with exchange suffix e.g. ASML.AS)
 * @returns Normalized quote, or null if no data (e.g. symbol not found or market closed)
 * @throws Error on HTTP errors or rate limit (429); does not expose API key in messages
 */
export async function getQuote(symbol: string): Promise<Quote | null> {
	const url = new URL(`${FINNHUB_BASE_URL}/quote`)
	url.searchParams.set('symbol', symbol)
	url.searchParams.set('token', env.FINNHUB_API_KEY)

	const response = await fetch(url.toString())

	if (response.status === 429) {
		throw new Error('Finnhub rate limit exceeded. Please try again later.')
	}

	if (!response.ok) {
		throw new Error(
			`Finnhub API error: ${response.status} ${response.statusText}`,
		)
	}

	const data = (await response.json()) as FinnhubQuoteRaw

	// Finnhub returns 0 for all fields when no data (e.g. invalid symbol or no trades)
	const hasData = data.c !== 0 || data.o !== 0 || data.pc !== 0
	if (!hasData) {
		return null
	}

	return normalizeQuote(data)
}

/**
 * Fetches quotes for multiple symbols. Runs requests sequentially to avoid rate limits.
 * @param symbols - Array of stock symbols
 * @returns Record of symbol -> quote (only includes symbols that returned data)
 */
export async function getQuotes(
	symbols: string[],
): Promise<Record<string, Quote>> {
	const result: Record<string, Quote> = {}
	const uniqueSymbols = [...new Set(symbols)]

	for (const symbol of uniqueSymbols) {
		try {
			const quote = await getQuote(symbol)
			if (quote) {
				result[symbol] = quote
			}
		} catch {
			// Skip failed symbols; client will show no price for them
		}
	}

	return result
}
