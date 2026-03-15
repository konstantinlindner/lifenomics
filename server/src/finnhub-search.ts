import { env } from './env'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

/**
 * Raw symbol lookup item from Finnhub Symbol Search API.
 * @see https://finnhub.io/docs/api/symbol-search
 */
export type FinnhubSymbolLookupItemRaw = {
	description?: string
	displaySymbol?: string
	symbol?: string
	type?: string
}

/**
 * Raw response from Finnhub Symbol Search API.
 */
export type FinnhubSymbolSearchRaw = {
	count?: number
	result?: FinnhubSymbolLookupItemRaw[] | null
}

/**
 * Normalized symbol search result item for use in the app.
 */
export type SymbolSearchResultItem = {
	description: string
	displaySymbol: string
	symbol: string
	type: string
}

/**
 * Fetches symbol search results from Finnhub.
 * @param query - Search query (e.g. company name or ticker)
 * @returns Array of normalized search result items (stocks and other types)
 * @throws Error on HTTP errors or rate limit (429)
 */
export async function searchSymbols(
	query: string,
): Promise<SymbolSearchResultItem[]> {
	if (!query.trim()) {
		return []
	}

	const url = new URL(`${FINNHUB_BASE_URL}/search`)
	url.searchParams.set('q', query.trim())
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

	const data = (await response.json()) as FinnhubSymbolSearchRaw
	const items = data.result ?? []

	return items
		.filter(
			(item): item is FinnhubSymbolLookupItemRaw & { symbol: string } =>
				typeof item.symbol === 'string' && item.symbol.length > 0,
		)
		.map((item) => ({
			description: item.description ?? '',
			displaySymbol: item.displaySymbol ?? item.symbol ?? '',
			symbol: item.symbol,
			type: item.type ?? '',
		}))
}
