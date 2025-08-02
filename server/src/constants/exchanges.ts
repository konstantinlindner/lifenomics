import { type Currency, currencies } from './currencies'

export type Exchange = {
	MIC: string
	name: string
	shortName?: string
	code?: string
	codeAlt?: string
	timeZoneName: string
	timeZoneShortName: string
	currency: Currency
	country: string
	city: string
	website: string
}

export const exchanges = {
	STOCKHOLM: {
		MIC: 'XSTO',
		name: 'Nasdaq Stockholm',
		shortName: 'Stockholm',
		code: 'STO',
		codeAlt: 'ST',
		timeZoneName: 'Europe/Stockholm',
		timeZoneShortName: 'CEST',
		currency: currencies.SEK,
		country: 'Sweden',
		city: 'Stockholm',
		website: 'https://www.nasdaq.com/solutions/european-markets/stockholm',
	},
	COPENHAGEN: {
		MIC: 'XCSE',
		name: 'Nasdaq Copenhagen',
		shortName: 'Copenhagen',
		code: 'COP',
		codeAlt: 'CO',
		timeZoneName: 'Europe/Copenhagen',
		timeZoneShortName: 'CEST',
		currency: currencies.DKK,
		country: 'Denmark',
		city: 'Copenhagen',
		website: 'https://www.nasdaq.com/solutions/european-markets/copenhagen',
	},
	HELSINKI: {
		MIC: 'XHEL',
		name: 'Nasdaq Helsinki',
		shortName: 'Helsinki',
		code: 'HEL',
		codeAlt: 'HE',
		timeZoneName: 'Europe/Helsinki',
		timeZoneShortName: 'EEST',
		currency: currencies.EUR,
		country: 'Finland',
		city: 'Helsinki',
		website: 'https://www.nasdaq.com/solutions/european-markets/helsinki',
	},
	AMSTERDAM: {
		MIC: 'XAMS',
		name: 'Euronext Amsterdam',
		shortName: 'Amsterdam',
		code: 'AMS',
		codeAlt: 'AS',
		timeZoneName: 'Europe/Amsterdam',
		timeZoneShortName: 'CEST',
		currency: currencies.EUR,
		country: 'Netherlands',
		city: 'Amsterdam',
		website: 'https://www.euronext.com/en/markets/amsterdam',
	},
	PARIS: {
		MIC: 'XPAR',
		name: 'Euronext Paris',
		shortName: 'Paris',
		code: 'PAR',
		codeAlt: 'PA',
		timeZoneName: 'Europe/Paris',
		timeZoneShortName: 'CEST',
		currency: currencies.EUR,
		country: 'France',
		city: 'Paris',
		website: 'https://www.euronext.com/en/markets/paris',
	},
	XETRA: {
		MIC: 'XETR',
		name: 'XETRA',
		shortName: 'XETRA',
		timeZoneName: 'Europe/Berlin',
		timeZoneShortName: 'CEST',
		currency: currencies.EUR,
		country: 'Germany',
		city: 'Frankfurt',
		website: 'https://www.xetra.com/xetra-en',
	},
	NYSE: {
		MIC: 'XNYS',
		name: 'New York Stock Exchange',
		shortName: 'NYSE',
		// code:
		// codeAlt:
		timeZoneName: 'America/New_York',
		timeZoneShortName: 'EDT',
		currency: currencies.USD,
		country: 'United States',
		city: 'New York',
		website: 'https://www.nyse.com',
	},
	NASDAQ: {
		MIC: 'XNAS',
		name: 'NASDAQ',
		// code:
		// codeAlt:
		timeZoneName: 'America/New_York',
		timeZoneShortName: 'EDT',
		currency: currencies.USD,
		country: 'United States',
		city: 'New York',
		website: 'https://www.nasdaq.com',
	},
} as const satisfies Record<string, Exchange>
