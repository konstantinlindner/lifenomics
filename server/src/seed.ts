import { assetTags as assetTagDefs } from './constants/assetTags'
import { companies as companyDefs } from './constants/companies'
import { currencies as currencyDefs } from './constants/currencies'
import { exchanges as exchangeDefs } from './constants/exchanges'
import { industries as industryDefs } from './constants/industries'
import { sectors as sectorDefs } from './constants/sectors'
import { stocks as stockDefs } from './constants/stocks'
import { transactions as transactionDefs } from './constants/transactions'
import { prisma } from './prisma'
import { hashPassword } from './utils/argon2'

async function main() {
	// Build industry -> sector name map from sector definitions
	const industryToSectorName = new Map<string, string>()
	for (const sector of Object.values(sectorDefs)) {
		for (const industry of sector.industries) {
			industryToSectorName.set(industry, sector.name)
		}
	}

	// 1) Currencies
	const currencyIdByName = new Map<string, number>()
	for (const name of Object.values(currencyDefs)) {
		const existing = await prisma.currency.findFirst({ where: { name } })
		const row =
			existing ??
			(await prisma.currency.create({
				data: { name },
			}))
		currencyIdByName.set(name, row.id)
	}

	// 2) Sectors
	const sectorIdByName = new Map<string, number>()
	for (const s of Object.values(sectorDefs)) {
		const name = s.name
		const existing = await prisma.sector.findFirst({ where: { name } })
		const row =
			existing ??
			(await prisma.sector.create({
				data: { name },
			}))
		sectorIdByName.set(name, row.id)
	}

	// 3) Industries
	const industryIdByName = new Map<string, number>()
	for (const name of Object.values(industryDefs)) {
		const sectorName = industryToSectorName.get(name)
		if (!sectorName) {
			console.warn(
				`Warning: Industry "${name}" not found in any sector, skipping`,
			)
			continue
		}

		const sectorId = sectorIdByName.get(sectorName)
		if (!sectorId) {
			console.warn(
				`Warning: Sector "${sectorName}" not found for industry "${name}", skipping`,
			)
			continue
		}

		const existing = await prisma.industry.findFirst({ where: { name } })
		const row =
			existing ??
			(await prisma.industry.create({
				data: {
					name,
					sectorId,
				},
			}))
		industryIdByName.set(name, row.id)
	}

	// 4) Asset Tags
	const assetTagIdByName = new Map<string, number>()
	for (const tagName of Object.values(assetTagDefs)) {
		const existing = await prisma.assetTag.findFirst({
			where: { name: tagName },
		})
		const row =
			existing ??
			(await prisma.assetTag.create({
				data: { name: tagName },
			}))
		assetTagIdByName.set(tagName, row.id)
	}

	// 5) Exchanges
	const exchangeIdByName = new Map<string, number>()
	for (const ex of Object.values(exchangeDefs)) {
		const name = ex.name
		const existing = await prisma.exchange.findFirst({ where: { name } })
		const row =
			existing ??
			(await prisma.exchange.create({
				data: {
					name: ex.name,
					shortName: ex.shortName ?? ex.name,
					MIC: ex.MIC,
					code: ex.code ?? null,
					codeAlt: ex.codeAlt ?? null,
					timezoneName: ex.timezoneName,
					timezoneShortName: ex.timezoneShortName,
					country: ex.country,
					city: ex.city,
					website: ex.website,
					emoji: ex.emoji,
					currencyId: currencyIdByName.get(ex.currency)!,
				},
			}))
		exchangeIdByName.set(name, row.id)
	}

	// 6) Companies
	const companyIdByName = new Map<string, number>()
	let companiesCreated = 0

	for (const [companyKey, company] of Object.entries(companyDefs)) {
		const industryId = industryIdByName.get(company.industry)
		if (!industryId) {
			console.warn(
				`Warning: Industry "${company.industry}" not found for company "${company.name}", skipping`,
			)
			continue
		}

		const existing = await prisma.company.findFirst({
			where: { name: company.name },
		})

		if (existing) {
			companyIdByName.set(companyKey, existing.id)
			continue
		}

		// Prepare asset tags connection
		const assetTagIds = company.tags
			.map((tagName) => ({ id: assetTagIdByName.get(tagName)! }))
			.filter((tag) => tag.id)

		const createdCompany = await prisma.company.create({
			data: {
				industryId,
				name: company.name,
				shortName: company.shortName,
				description: company.description,
				imageUrl: company.imageUrl ?? null,
				website: company.website,
				tags: {
					connect: assetTagIds,
				},
			},
		})

		companyIdByName.set(companyKey, createdCompany.id)
		companiesCreated++
	}

	// 7) Stocks
	const stockIdByIsin = new Map<string, number>()
	let stocksCreated = 0

	for (const stock of Object.values(stockDefs)) {
		const exchangeId = exchangeIdByName.get(stock.exchange.name)
		if (!exchangeId) {
			console.warn(
				`Warning: Exchange "${stock.exchange.name}" not found for stock "${stock.ticker}", skipping`,
			)
			continue
		}

		// Find the company by matching the company object reference
		let companyId: number | undefined
		for (const [companyKey, company] of Object.entries(companyDefs)) {
			if (company === stock.company) {
				companyId = companyIdByName.get(companyKey)
				break
			}
		}

		if (!companyId) {
			console.warn(
				`Warning: Company not found for stock "${stock.ticker}", skipping`,
			)
			continue
		}

		const existing = await prisma.stock.findFirst({
			where: { isin: stock.isin },
		})

		if (existing) {
			stockIdByIsin.set(stock.isin, existing.id)
			console.log(`Stock "${stock.ticker}" already exists, skipping`)
			continue
		}

		const createdStock = await prisma.stock.create({
			data: {
				companyId,
				exchangeId,
				isin: stock.isin,
				ticker: stock.ticker,
				class: 'class' in stock ? (stock.class ?? null) : null,
				isActive: stock.isActive,
				adr: stock.adr,
			},
		})

		stockIdByIsin.set(stock.isin, createdStock.id)
		stocksCreated++
	}

	// 8) Default User (for transactions)
	let defaultUserId: number
	const existingUser = await prisma.user.findFirst({
		where: { email: 'admin@lifenomics.com' },
	})

	if (existingUser) {
		defaultUserId = existingUser.id
		console.log('Default user already exists, using existing user')
	} else {
		const defaultUser = await prisma.user.create({
			data: {
				email: 'hello@konte.se',
				password: await hashPassword('konte123'),
				firstName: 'Konstantin',
				lastName: 'Lindner',
				role: 'admin',
			},
		})
		defaultUserId = defaultUser.id
		console.log('Created default user for transactions')
	}

	// 9) Transactions
	let transactionsCreated = 0
	let transactionsSkipped = 0
	let transactionErrors = 0

	for (const transaction of transactionDefs) {
		try {
			// Find the stock by ISIN
			const stockId = stockIdByIsin.get(transaction.stock.isin)
			if (!stockId) {
				console.warn(
					`Warning: Stock with ISIN "${transaction.stock.isin}" not found, skipping transaction`,
				)
				transactionsSkipped++
				continue
			}

			// Check if transaction already exists (idempotency)
			const existingTransaction = await prisma.transaction.findFirst({
				where: {
					stockId,
					userId: defaultUserId,
					transactionType: transaction.transactionType,
					quantity: transaction.quantity,
					price: transaction.price,
					timestamp: new Date(transaction.timestamp),
				},
			})

			if (existingTransaction) {
				console.log(
					`Transaction already exists for ${transaction.stock.ticker}, skipping`,
				)
				transactionsSkipped++
				continue
			}

			// Create the transaction
			await prisma.transaction.create({
				data: {
					stockId,
					userId: defaultUserId,
					transactionType: transaction.transactionType,
					quantity: transaction.quantity,
					price: transaction.price,
					timestamp: new Date(transaction.timestamp),
				},
			})

			console.log(
				`Created transaction: ${transaction.transactionType} ${transaction.quantity} ${transaction.stock.ticker} @ ${transaction.price}`,
			)
			transactionsCreated++
		} catch (error) {
			console.error(
				`Error creating transaction for ${transaction.stock.ticker}:`,
				error,
			)
			transactionErrors++
		}
	}

	console.log(
		`Seed complete. Companies created: ${companiesCreated}, Stocks created: ${stocksCreated}, Transactions created: ${transactionsCreated}, Transactions skipped: ${transactionsSkipped}, Transaction errors: ${transactionErrors}`,
	)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
