export const currencies = {
	USD: 'USD',
	EUR: 'EUR',
	SEK: 'SEK',
	DKK: 'DKK',
} as const

export type Currency = (typeof currencies)[keyof typeof currencies]
