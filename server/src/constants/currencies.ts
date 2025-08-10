export const currencies = {
	USD: 'USD',
	EUR: 'EUR',
	SEK: 'SEK',
	DKK: 'DKK',
	CAD: 'CAD',
	CZK: 'CZK',
	NOK: 'NOK',
	CHF: 'CHF',
} as const

export type Currency = (typeof currencies)[keyof typeof currencies]
