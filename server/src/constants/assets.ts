import type { AssetType } from '@lifenomics/shared/schemas'

import { type AssetTag, assetTags } from './assetTags'
import { type Exchange, exchanges } from './exchanges'
import { type Industry, industries } from './industries'

type Asset = {
	exchange: Exchange
	type: AssetType
	industry: Industry
	tags: AssetTag[]
	isActive: boolean
	isin?: string
	ticker: string
	name: string
	shortName?: string
	class?: 'A' | 'B' | 'C'
	adr?: boolean
	description?: string
	imageUrl?: string
	website?: string
}

export const assets = {
	NL0010273215: {
		exchange: exchanges.AMSTERDAM,
		type: 'stock',
		industry: industries.semiconductorEquipmentMaterials,
		tags: [
			assetTags.semiconductors,
			assetTags.industry,
			assetTags.technology,
			assetTags.hardware,
		],
		isActive: true,
		isin: 'NL0010273215',
		ticker: 'ASML',
		name: 'ASML Holding N.V.',
		shortName: 'ASML Holding',
		// description:
		// imageUrl:
		website: 'https://www.asml.com/en',
	},
	US8740391003: {
		exchange: exchanges.NYSE,
		type: 'stock',
		industry: industries.semiconductors,
		tags: [
			assetTags.semiconductors,
			assetTags.industry,
			assetTags.technology,
			assetTags.hardware,
		],
		isActive: true,
		isin: 'US8740391003',
		ticker: 'TSM',
		name: 'Taiwan Semiconductor Manufacturing Company Limited',
		shortName: 'Taiwan Semicond Mfg Co',
		adr: true,
		// description:
		// imageUrl:
		website: 'https://www.tsmc.com/english',
	},
	US0231351067: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.internetRetail,
		tags: [
			assetTags.technology,
			assetTags.software,
			assetTags.cloud,
			assetTags.eCommerce,
		],
		isActive: true,
		isin: 'US0231351067',
		ticker: 'AMZN',
		name: 'Amazon.com, Inc.',
		shortName: 'Amazon.com',
		// description:
		// imageUrl:
		website: 'https://www.amazon.com',
	},
	US67066G1040: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.semiconductors,
		tags: [
			assetTags.semiconductors,
			assetTags.hardware,
			assetTags.technology,
		],
		isActive: true,
		isin: 'US67066G1040',
		ticker: 'NVDA',
		name: 'NVIDIA Corporation',
		shortName: 'NVIDIA',

		// description:
		// imageUrl:
		website: 'https://www.nvidia.com/en-us/',
	},
	US0079031078: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.semiconductors,
		tags: [
			assetTags.semiconductors,
			assetTags.hardware,
			assetTags.technology,
		],
		isActive: true,
		isin: 'US0079031078',
		ticker: 'AMD',
		name: 'Advanced Micro Devices, Inc.',
		shortName: 'Advanced Micro Devices',
		// description:
		// imageUrl:
		website: 'https://www.amd.com/en.html',
	},
	SE0021921269: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.aerospaceDefense,
		tags: [assetTags.industry, assetTags.technology, assetTags.defense],
		isActive: true,
		isin: 'SE0021921269',
		ticker: 'SAAB-B',
		name: 'Saab AB',
		shortName: 'SAAB',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://www.saab.com/',
	},
	US0378331005: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.consumerElectronics,
		tags: [
			assetTags.technology,
			assetTags.software,
			assetTags.cloud,
			assetTags.consumer,
			assetTags.hardware,
		],
		isActive: true,
		isin: 'US0378331005',
		ticker: 'AAPL',
		name: 'Apple Inc.',
		shortName: 'Apple',
		// description:
		// imageUrl:
		website: 'https://www.apple.com',
	},
	NL0000235190: {
		exchange: exchanges.PARIS,
		type: 'stock',
		industry: industries.aerospaceDefense,
		tags: [
			assetTags.industry,
			assetTags.defense,
			assetTags.technology,
			assetTags.commercialVehicles,
		],
		isActive: true,
		isin: 'NL0000235190',
		ticker: 'AIR',
		name: 'Airbus SE',
		shortName: 'Airbus',
		// description:
		// imageUrl:
		website: 'https://www.airbus.com/en',
	},
	US02079K3059: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.internetContentInformation,
		tags: [assetTags.technology, assetTags.software, assetTags.cloud],
		isActive: true,
		isin: 'US02079K3059',
		ticker: 'GOOGL',
		name: 'Alphabet Inc.',
		shortName: 'Alphabet',
		class: 'A',
		// description:
		// imageUrl:
		website: 'https://www.google.com',
	},
	SE0015657788: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.softwareInfrastructure,
		tags: [assetTags.technology, assetTags.cybersecurity],
		isActive: true,
		isin: 'SE0015657788',
		ticker: 'YUBICO',
		name: 'Yubico AB',
		shortName: 'Yubico',
		// description:
		// imageUrl:
		website: 'https://www.yubico.com',
	},
	US30303M1027: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.internetContentInformation,
		tags: [assetTags.technology, assetTags.software],
		isActive: true,
		isin: 'US30303M1027',
		ticker: 'META',
		name: 'Meta Platforms, Inc.',
		shortName: 'Meta Platforms',
		class: 'A',
		// description:
		// imageUrl:
		website: 'https://www.meta.com',
	},
	SE0000115446: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.farmHeavyConstructionMachinery,
		tags: [assetTags.industry, assetTags.commercialVehicles],
		isActive: true,
		isin: 'SE0000115446',
		ticker: 'VOLV-B',
		name: 'AB Volvo',
		shortName: 'Volvo',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://www.volvo.com/en/',
	},
	US90353T1007: {
		exchange: exchanges.NYSE,
		type: 'stock',
		industry: industries.softwareApplication,
		tags: [assetTags.technology, assetTags.software],
		isActive: true,
		isin: 'US90353T1007',
		ticker: 'UBER',
		name: 'Uber Technologies, Inc.',
		shortName: 'Uber',
		// description:
		// imageUrl:
		website: 'https://www.uber.com',
	},
	GB0009895292: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.drugManufacturersGeneral,
		tags: [
			assetTags.pharmaceuticals,
			assetTags.biotechnology,
			assetTags.healthcare,
		],
		isActive: true,
		isin: 'GB0009895292',
		ticker: 'AZN',
		name: 'AstraZeneca PLC',
		shortName: 'AstraZeneca',
		// description:
		// imageUrl:
		website: 'https://www.astrazeneca.com',
	},
	DK0062498333: {
		exchange: exchanges.COPENHAGEN,
		type: 'stock',
		industry: industries.drugManufacturersGeneral,
		tags: [
			assetTags.pharmaceuticals,
			assetTags.biotechnology,
			assetTags.healthcare,
		],
		isActive: true,
		isin: 'DK0062498333',
		ticker: 'NOVO-B',
		name: 'Novo Nordisk A/S',
		shortName: 'Novo Nordisk',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://www.novonordisk.com',
	},
	US5951121038: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.semiconductors,
		tags: [
			assetTags.semiconductors,
			assetTags.hardware,
			assetTags.technology,
		],
		isActive: true,
		isin: 'US5951121038',
		ticker: 'MU',
		name: 'Micron Technology, Inc.',
		shortName: 'Micron Technology',
		// description:
		// imageUrl:
		website: 'https://www.micron.com',
	},
	US5949181045: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.softwareInfrastructure,
		tags: [assetTags.technology, assetTags.software, assetTags.cloud],
		isActive: true,
		isin: 'US5949181045',
		ticker: 'MSFT',
		name: 'Microsoft Corporation',
		shortName: 'Microsoft',
		// description:
		// imageUrl:
		website: 'https://www.microsoft.com',
	},
	US4330001060: {
		exchange: exchanges.NYSE,
		type: 'stock',
		industry: industries.householdPersonalProducts,
		tags: [assetTags.healthcare, assetTags.pharmaceuticals],
		isActive: true,
		isin: 'US4330001060',
		ticker: 'HIMS',
		name: 'Hims & Hers Health, Inc.',
		shortName: 'Hims & Hers Health',
		class: 'A',
		// description:
		// imageUrl:
		website: 'https://investors.hims.com/overview/default.aspx',
	},
	US68373M1071: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.internetContentInformation,
		tags: [assetTags.technology, assetTags.software],
		isActive: true,
		isin: 'US68373M1071',
		ticker: 'OPRA',
		name: 'Opera Limited',
		shortName: 'Opera',
		adr: true,
		// description:
		// imageUrl:
		website: 'https://www.opera.com',
	},
	SE0015661236: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.assetManagement,
		tags: [assetTags.investmentCompanies, assetTags.finance],
		isActive: true,
		isin: 'SE0015661236',
		ticker: 'CRED-A',
		name: 'Creades',
		shortName: 'Creades',
		class: 'A',
		// description:
		// imageUrl:
		website: 'https://www.creades.se',
	},
	SE0009216278: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.leisure,
		tags: [assetTags.hardware, assetTags.technology, assetTags.consumer],
		isActive: true,
		isin: 'SE0009216278',
		ticker: 'MIPS',
		name: 'Mips AB',
		shortName: 'Mips',
		// description:
		// imageUrl:
		website: 'https://mipsprotection.com',
	},
	SE0006993770: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.groceryStores,
		tags: [assetTags.consumer],
		isActive: true,
		isin: 'SE0006993770',
		ticker: 'AXFO',
		name: 'Axfood AB',
		shortName: 'Axfood',
		// description:
		// imageUrl:
		website: 'https://www.axfood.se/',
	},
	US7475251036: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.semiconductors,
		tags: [
			assetTags.semiconductors,
			assetTags.hardware,
			assetTags.technology,
		],
		isActive: true,
		isin: 'US7475251036',
		ticker: 'QCOM',
		name: 'QUALCOMM Incorporated',
		shortName: 'QUALCOMM',
		// description:
		// imageUrl:
		website: 'https://www.qualcomm.com',
	},
	DE000PAH0038: {
		exchange: exchanges.XETRA,
		type: 'stock',
		industry: industries.autoManufacturers,
		tags: [assetTags.automotive, assetTags.industry, assetTags.consumer],
		isActive: true,
		isin: 'DE000PAH0038',
		ticker: 'PAH3d',
		name: 'Porsche Automobil Holding SE',
		shortName: 'Porsche Automobil Holding',
		// description:
		// imageUrl:
		website: 'https://www.porsche-se.com/en/',
	},
	SE0015811963: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.assetManagement,
		tags: [assetTags.investmentCompanies, assetTags.finance],
		isActive: true,
		isin: 'SE0015811963',
		ticker: 'INVE-B',
		name: 'Investor AB',
		shortName: 'Investor',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://www.investorab.com',
	},
	SE0010442418: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.telecomServices,
		tags: [assetTags.consumer, assetTags.telecom],
		isActive: true,
		isin: 'SE0010442418',
		ticker: 'BAHN-B',
		name: 'Bahnhof AB',
		shortName: 'Bahnhof',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://bahnhof.se',
	},
	US19260Q1076: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.financialDataStockExchanges,
		tags: [
			assetTags.technology,
			assetTags.software,
			assetTags.finance,
			assetTags.crypto,
		],
		isActive: true,
		isin: 'US19260Q1076',
		ticker: 'COIN',
		name: 'Coinbase Global, Inc.',
		shortName: 'Coinbase',
		class: 'A',
		// description:
		// imageUrl:
		website: 'https://www.coinbase.com',
	},
	FI0009013403: {
		exchange: exchanges.HELSINKI,
		type: 'stock',
		industry: industries.specialtyIndustrialMachinery,
		tags: [assetTags.industry, assetTags.technology],
		isActive: true,
		isin: 'FI0009013403',
		ticker: 'KNEBV',
		name: 'Kone oyj',
		shortName: 'Kone',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://www.kone.com/en',
	},
	// alibaba group adr
	US01609W1027: {
		exchange: exchanges.NYSE,
		type: 'stock',
		industry: industries.internetRetail,
		tags: [
			assetTags.technology,
			assetTags.software,
			assetTags.eCommerce,
			assetTags.consumer,
			assetTags.cloud,
			assetTags.ai,
		],
		isActive: true,
		isin: 'US01609W1027',
		ticker: 'BABA',
		name: 'Alibaba Group Holding Limited',
		shortName: 'Alibaba Group',
		// description:
		// imageUrl:
		website: 'https://www.alibaba.com',
	},
	US11135F1012: {
		exchange: exchanges.NASDAQ,
		type: 'stock',
		industry: industries.semiconductors,
		tags: [
			assetTags.semiconductors,
			assetTags.hardware,
			assetTags.technology,
			assetTags.dataCenter,
		],
		isActive: true,
		isin: 'US11135F1012',
		ticker: 'AVGO',
		name: 'Broadcom Inc.',
		shortName: 'Broadcom',
		// description:
		// imageUrl:
		website: 'https://www.broadcom.com',
	},
	SE0000584948: {
		exchange: exchanges.STOCKHOLM,
		type: 'stock',
		industry: industries.specialtyRetail,
		tags: [assetTags.consumer, assetTags.retail],
		isActive: true,
		isin: 'SE0000584948',
		ticker: 'CLAS-B',
		name: 'Clas Ohlson AB',
		shortName: 'Clas Ohlson',
		class: 'B',
		// description:
		// imageUrl:
		website: 'https://www.clasohlson.com/',
	},
	// safello group
	// shopify
	// nu holdings
	// coupang a
	// avanza bank
	// grab a
	// lundin mining corporation
	// k33
	// marqeta a
	// robinhood markets a
	// ryanair holdings plc
	// abb
	// applied materials
	// sea adr a
	// skistar b
	// hexagon b
	// zeekr intelligent technology holding
	// airbnb a
	// tomra systems
	// orkla
	// fortnox
	// getinge b
	// canadian national railway
	// walmart
	// axa
	// canadian pacific kansas city
	// rivian automotive a
	// huhtamäki
	// coca-cola
	// cloetta
	// nike
	// korea electric power adr
	// bank of nova scotia
	// cameco
	// block a
	// cyclezyme
} as const satisfies Record<string, Asset>
