import { env } from './env'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

/**
 * Raw company/market news item from Finnhub.
 * @see https://finnhub.io/docs/api/company-news
 * @see https://finnhub.io/docs/api/market-news
 */
export type FinnhubNewsItemRaw = {
	category?: string
	datetime?: number
	headline?: string
	id?: number
	image?: string
	related?: string
	source?: string
	summary?: string
	url?: string
}

/**
 * Normalized news item for use in the app.
 */
export type NewsItem = {
	category: string | null
	datetime: number
	headline: string
	id: number
	image: string | null
	related: string | null
	source: string | null
	summary: string | null
	url: string | null
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

function normalizeNewsItem(raw: FinnhubNewsItemRaw): NewsItem {
	return {
		category: raw.category ?? null,
		datetime: raw.datetime ?? 0,
		headline: raw.headline ?? '',
		id: raw.id ?? 0,
		image: raw.image ?? null,
		related: raw.related ?? null,
		source: raw.source ?? null,
		summary: raw.summary ?? null,
		url: raw.url ?? null,
	}
}

/**
 * Fetches company news for a symbol in a date range.
 * @param symbol - Stock symbol (e.g. AAPL)
 * @param from - Start date YYYY-MM-DD
 * @param to - End date YYYY-MM-DD
 * @returns Array of normalized news items
 */
export async function getCompanyNews(
	symbol: string,
	from: string,
	to: string,
): Promise<NewsItem[]> {
	const url = buildUrl('/company-news', { symbol, from, to })
	const data = (await fetchFinnhub(url)) as FinnhubNewsItemRaw[]
	if (!Array.isArray(data)) return []
	return data.map(normalizeNewsItem)
}

/**
 * Market news category (general, crypto, forex).
 */
export type MarketNewsCategory = 'general' | 'crypto' | 'forex'

/**
 * Fetches market news by category.
 * @param category - general, crypto, or forex
 * @returns Array of normalized news items
 */
export async function getMarketNews(
	category: MarketNewsCategory = 'general',
): Promise<NewsItem[]> {
	const url = buildUrl('/news', { category })
	const data = (await fetchFinnhub(url)) as FinnhubNewsItemRaw[]
	if (!Array.isArray(data)) return []
	return data.map(normalizeNewsItem)
}
