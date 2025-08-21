import { assetTags as assetTagDefs } from '../constants/assetTags'
import { assets as assetDefs } from '../constants/assets'
import { currencies as currencyDefs } from '../constants/currencies'
import { exchanges as exchangeDefs } from '../constants/exchanges'
import { industries as industryDefs } from '../constants/industries'
import { sectors as sectorDefs } from '../constants/sectors'
import { prisma } from '../prisma'

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
					shortName: ex.shortName ?? null,
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

	// 6) Assets
	let createdCount = 0
	let skippedCount = 0

	for (const a of Object.values(assetDefs)) {
		const exchangeId = exchangeIdByName.get(a.exchange.name)
		if (!exchangeId) {
			skippedCount++
			continue
		}

		const industryId = industryIdByName.get(a.industry)
		if (!industryId) {
			console.warn(
				`Warning: Industry "${a.industry}" not found for asset "${a.ticker}", skipping`,
			)
			skippedCount++
			continue
		}

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

		// Prepare asset tags connection
		const assetTagIds = a.tags
			.map((tagName) => ({ id: assetTagIdByName.get(tagName)! }))
			.filter((tag) => tag.id)

		await prisma.asset.create({
			data: {
				exchangeId,
				industryId,
				type: a.type,
				isin: a.isin ?? null,
				ticker: a.ticker,
				name: a.name,
				shortName: a.shortName ?? null,
				class: 'class' in a ? (a.class ?? null) : null,
				adr: 'adr' in a ? (a.adr ?? null) : null,
				description: a.description ?? null,
				imageUrl: a.imageUrl ?? null,
				website: a.website ?? null,
				tags: {
					connect: assetTagIds,
				},
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
