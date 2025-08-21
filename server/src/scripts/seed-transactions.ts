import { assets } from '../constants/assets'
import { transactions } from '../constants/transactions'
import { prisma } from '../prisma'

async function main() {
	console.log('Starting transaction seeding...')

	let createdCount = 0
	let skippedCount = 0
	let errorCount = 0

	for (const transaction of transactions) {
		try {
			// Find the asset by ticker
			const asset = Object.values(assets).find(
				(a) => a.ticker === transaction.asset.ticker,
			)
			if (!asset) {
				console.warn(
					`Warning: Asset with ticker "${transaction.asset.ticker}" not found, skipping transaction`,
				)
				skippedCount++
				continue
			}

			// Get the asset ID from the database
			const assetRecord = await prisma.asset.findFirst({
				where: { ticker: transaction.asset.ticker },
			})

			if (!assetRecord) {
				console.warn(
					`Warning: Asset "${transaction.asset.ticker}" not found in database, skipping transaction`,
				)
				skippedCount++
				continue
			}

			// Check if transaction already exists (idempotency)
			const existingTransaction = await prisma.transaction.findFirst({
				where: {
					assetId: assetRecord.id,
					userId: 1,
					transactionType: transaction.transactionType,
					quantity: transaction.quantity,
					price: transaction.price,
					timestamp: new Date(transaction.timestamp),
				},
			})

			if (existingTransaction) {
				console.log(
					`Transaction already exists for ${transaction.asset.ticker}, skipping`,
				)
				skippedCount++
				continue
			}

			// Create the transaction
			await prisma.transaction.create({
				data: {
					assetId: assetRecord.id,
					userId: 1,
					transactionType: transaction.transactionType,
					quantity: transaction.quantity,
					price: transaction.price,
					timestamp: new Date(transaction.timestamp),
				},
			})

			console.log(
				`Created transaction: ${transaction.transactionType} ${transaction.quantity} ${transaction.asset.ticker} @ ${transaction.price}`,
			)
			createdCount++
		} catch (error) {
			console.error(
				`Error creating transaction for ${transaction.asset.ticker}:`,
				error,
			)
			errorCount++
		}
	}

	console.log(`\nTransaction seeding complete:`)
	console.log(`- Created: ${createdCount}`)
	console.log(`- Skipped: ${skippedCount}`)
	console.log(`- Errors: ${errorCount}`)
}

main()
	.catch((e) => {
		console.error('Fatal error during transaction seeding:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
