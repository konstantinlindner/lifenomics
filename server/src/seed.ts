import { DEFAULT_PORTFOLIO_SYMBOLS } from './constants/portfolio-seed-symbols'
import { prisma } from './prisma'

async function main() {
	let defaultUserId: number
	const existingUser = await prisma.user.findFirst({
		where: { email: 'hello@konte.se' },
	})

	if (existingUser) {
		defaultUserId = existingUser.id
		console.log('Default user already exists, using existing user')
	} else {
		const defaultUser = await prisma.user.create({
			data: {
				email: 'hello@konte.se',
				name: 'Konstantin Lindner',
				emailVerified: true,
				password: '',
				firstName: 'Konstantin',
				lastName: 'Lindner',
				role: 'user',
			},
		})
		defaultUserId = defaultUser.id
		console.log('Created default user')
	}

	let positionsCreated = 0
	let positionsSkipped = 0

	for (const symbol of DEFAULT_PORTFOLIO_SYMBOLS) {
		const existing = await prisma.portfolioPosition.findUnique({
			where: {
				userId_symbol: {
					userId: defaultUserId,
					symbol,
				},
			},
		})

		if (existing) {
			positionsSkipped++
			continue
		}

		await prisma.portfolioPosition.create({
			data: {
				userId: defaultUserId,
				symbol,
				quantity: 1,
				averagePurchasePrice: 1,
				currency: 'USD',
			},
		})
		positionsCreated++
	}

	console.log(
		`Seed complete. Portfolio positions created: ${positionsCreated}, skipped (already exist): ${positionsSkipped}`,
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
