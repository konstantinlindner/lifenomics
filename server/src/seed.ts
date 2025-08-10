import { assets as assetDefs } from './constants/assets'
import { currencies as currencyDefs } from './constants/currencies'
import { exchanges as exchangeDefs } from './constants/exchanges'
import { sectors as sectorDefs } from './constants/sectors'
import { prisma } from './prisma'

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

	// 3) Exchanges
	const exchangeIdByName = new Map<string, number>()
	for (const ex of Object.values(exchangeDefs)) {
		const name = ex.name
		const existing = await prisma.exchange.findFirst({ where: { name } })
		const row =
			existing ??
			(await prisma.exchange.create({
				data: {
					name: ex.name,
					shortName: ex.shortName ?? null,
					timezoneName: ex.timeZoneName,
					timezoneShortName: ex.timeZoneShortName,
					country: ex.country,
					city: ex.city,
					website: ex.website,
					currency: {
						connect: { id: currencyIdByName.get(ex.currency)! },
					},
				},
			}))
		exchangeIdByName.set(name, row.id)
	}

	// 4) Assets
	let createdCount = 0
	let skippedCount = 0

	for (const a of Object.values(assetDefs)) {
		const exchangeId = exchangeIdByName.get(a.exchange.name)
		if (!exchangeId) {
			skippedCount++
			continue
		}

		// Decide sector via industry -> sector map
		const sectorName = industryToSectorName.get(a.industry)
		const sectorId = sectorName ? sectorIdByName.get(sectorName) : undefined

		// Idempotency: prefer matching by ISIN if present; else fallback ticker+exchange
		let existing = null as null | { id: number }
		if (a.isin) {
			existing = await prisma.asset.findFirst({ where: { isin: a.isin } })
		}
		if (!existing) {
			existing = await prisma.asset.findFirst({
				where: { ticker: a.ticker, exchangeId },
			})
		}

		if (existing) {
			skippedCount++
			continue
		}

		await prisma.asset.create({
			data: {
				exchange: { connect: { id: exchangeId } },
				type: a.type,
				isin: a.isin ?? null,
				ticker: a.ticker,
				name: a.name,
				shortName: a.shortName ?? null,
				description: a.description ?? null,
				imageUrl: a.imageUrl ?? null,
				website: a.website ?? null,
				...(sectorId ?
					{
						sectors: {
							connect: [{ id: sectorId }],
						},
					}
				:	{}),
			},
		})
		createdCount++
	}

	console.log(
		`Seed complete. Assets created: ${createdCount}, skipped: ${skippedCount}`,
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
