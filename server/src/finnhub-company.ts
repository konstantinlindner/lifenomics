import { env } from './env'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

/**
 * Raw company profile response from Finnhub Company Profile 2 API.
 * @see https://finnhub.io/docs/api/company-profile2
 */
export type FinnhubCompanyProfile2Raw = {
	name?: string
	ticker?: string
	logo?: string
	exchange?: string
	ipo?: string
	finnhubIndustry?: string
	weburl?: string
	description?: string
}

/**
 * Normalized company profile for use in the app.
 */
export type CompanyProfile = {
	name: string
	ticker: string
	logo: string | null
	exchange: string
	ipo: string | null
	industry: string | null
	webUrl: string | null
	description: string | null
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

function normalizeCompanyProfile(
	raw: FinnhubCompanyProfile2Raw | null,
	symbol: string,
): CompanyProfile | null {
	if (!raw || (!raw.name && !raw.ticker)) {
		return null
	}
	return {
		name: raw.name ?? '',
		ticker: raw.ticker ?? symbol,
		logo: raw.logo ?? null,
		exchange: raw.exchange ?? '',
		ipo: raw.ipo ?? null,
		industry: raw.finnhubIndustry ?? null,
		webUrl: raw.weburl ?? null,
		description: raw.description ?? null,
	}
}

/**
 * Fetches company profile for a symbol from Finnhub.
 * @param symbol - Stock symbol (e.g. AAPL)
 * @returns Normalized profile, or null if not found
 */
export async function getCompanyProfile(
	symbol: string,
): Promise<CompanyProfile | null> {
	const url = buildUrl('/stock/profile2', { symbol })
	const data = (await fetchFinnhub(url)) as FinnhubCompanyProfile2Raw | null
	return normalizeCompanyProfile(data, symbol)
}

/**
 * Raw recommendation trend item from Finnhub.
 * @see https://finnhub.io/docs/api/recommendation-trends
 */
export type FinnhubRecommendationTrendRaw = {
	buy?: number
	hold?: number
	period?: string
	sell?: number
	strongBuy?: number
	strongSell?: number
	symbol?: string
}

/**
 * Normalized recommendation trend for use in the app.
 */
export type RecommendationTrend = {
	buy: number
	hold: number
	period: string
	sell: number
	strongBuy: number
	strongSell: number
	symbol: string
}

/**
 * Fetches analyst recommendation trends for a symbol.
 * @param symbol - Stock symbol (e.g. AAPL)
 * @returns Array of normalized recommendation trends (chronological)
 */
export async function getRecommendationTrends(
	symbol: string,
): Promise<RecommendationTrend[]> {
	const url = buildUrl('/stock/recommendation', { symbol })
	const data = (await fetchFinnhub(url)) as
		| FinnhubRecommendationTrendRaw[]
		| null
	if (!Array.isArray(data)) return []
	return data.map((raw) => ({
		buy: raw.buy ?? 0,
		hold: raw.hold ?? 0,
		period: raw.period ?? '',
		sell: raw.sell ?? 0,
		strongBuy: raw.strongBuy ?? 0,
		strongSell: raw.strongSell ?? 0,
		symbol: raw.symbol ?? symbol,
	}))
}

/**
 * Raw price target response from Finnhub.
 * @see https://finnhub.io/docs/api/price-target
 */
export type FinnhubPriceTargetRaw = {
	lastUpdated?: string
	symbol?: string
	targetHigh?: number
	targetLow?: number
	targetMean?: number
	targetMedian?: number
}

/**
 * Normalized price target for use in the app.
 */
export type PriceTarget = {
	lastUpdated: string | null
	symbol: string
	targetHigh: number | null
	targetLow: number | null
	targetMean: number | null
	targetMedian: number | null
}

/**
 * Fetches analyst price target for a symbol.
 * @param symbol - Stock symbol (e.g. AAPL)
 * @returns Normalized price target, or null if no data
 */
export async function getPriceTarget(
	symbol: string,
): Promise<PriceTarget | null> {
	const url = buildUrl('/stock/price-target', { symbol })
	const data = (await fetchFinnhub(url)) as FinnhubPriceTargetRaw | null
	if (!data || (data.targetMean == null && data.targetMedian == null)) {
		return null
	}
	return {
		lastUpdated: data.lastUpdated ?? null,
		symbol: data.symbol ?? symbol,
		targetHigh: data.targetHigh ?? null,
		targetLow: data.targetLow ?? null,
		targetMean: data.targetMean ?? null,
		targetMedian: data.targetMedian ?? null,
	}
}
