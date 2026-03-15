import { env } from './env'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

/**
 * Resolution for candle data.
 * @see https://finnhub.io/docs/api/stock-candles
 */
export type CandleResolution = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M'

/**
 * Raw stock candle response from Finnhub.
 * Arrays are parallel by index: s is status, t timestamps, o open, h high, l low, c close, v volume.
 */
export type FinnhubStockCandleRaw = {
	s?: string
	t?: number[]
	o?: number[]
	h?: number[]
	l?: number[]
	c?: number[]
	v?: number[]
}

/**
 * Single OHLCV candle for use in the app.
 */
export type Candle = {
	timestamp: number
	open: number
	high: number
	low: number
	close: number
	volume: number
}

/**
 * Normalized candle response.
 */
export type StockCandlesResult = {
	status: string
	candles: Candle[]
}

function buildUrl(path: string, params: Record<string, string>): string {
	const url = new URL(`${FINNHUB_BASE_URL}${path}`)
	url.searchParams.set('token', env.FINNHUB_API_KEY)
	for (const [key, value] of Object.entries(params)) {
		if (value) url.searchParams.set(key, value)
	}
	return url.toString()
}

async function fetchFinnhub<T>(url: string): Promise<T> {
	const response = await fetch(url)
	if (response.status === 429) {
		throw new Error('Finnhub rate limit exceeded. Please try again later.')
	}
	if (!response.ok) {
		throw new Error(
			`Finnhub API error: ${response.status} ${response.statusText}`,
		)
	}
	return response.json() as Promise<T>
}

/**
 * Fetches OHLC candle data for a symbol from Finnhub.
 * @param symbol - Stock symbol (e.g. AAPL)
 * @param resolution - 1, 5, 15, 30, 60, D, W, M
 * @param from - Unix timestamp (seconds)
 * @param to - Unix timestamp (seconds)
 * @returns Normalized candles or empty array on no data
 */
export async function getStockCandles(
	symbol: string,
	resolution: CandleResolution,
	from: number,
	to: number,
): Promise<StockCandlesResult> {
	const url = buildUrl('/stock/candle', {
		symbol,
		resolution,
		from: String(from),
		to: String(to),
	})
	const data = (await fetchFinnhub(url)) as FinnhubStockCandleRaw

	const status = data.s ?? 'no_data'
	const t = data.t ?? []
	const o = data.o ?? []
	const h = data.h ?? []
	const l = data.l ?? []
	const c = data.c ?? []
	const v = data.v ?? []

	const candles: Candle[] = t.map((timestamp, i) => ({
		timestamp,
		open: o[i] ?? 0,
		high: h[i] ?? 0,
		low: l[i] ?? 0,
		close: c[i] ?? 0,
		volume: v[i] ?? 0,
	}))

	return { status, candles }
}
