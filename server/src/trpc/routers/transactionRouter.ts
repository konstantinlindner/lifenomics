import { TRPCError, inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import prisma from 'src/prisma'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

export const transactionTypeSchema = z.enum(['purchase', 'sale'])

const createSchema = z.object({
	assetId: z.number(),
	transactionType: transactionTypeSchema,
	quantity: z.number(),
	price: z.number(),
	date: z.string(),
})

const updateSchema = z.object({
	id: z.number(),
	assetId: z.number().optional(),
	transactionType: transactionTypeSchema.optional(),
	quantity: z.number().optional(),
	price: z.number().optional(),
	date: z.string().optional(),
})

export const transactionRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const transactions = await prisma.transaction.findMany({
			where: {
				asset: {
					portfolio: {
						userId: ctx.user.id,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		if (!transactions.length) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'No transactions found',
			})
		}

		return transactions
	}),

	getById: protectedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			const transaction = await prisma.transaction.findUnique({
				where: {
					id: input,
					asset: {
						portfolio: {
							userId: ctx.user.id,
						},
					},
				},
			})

			if (!transaction) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Transaction not found',
				})
			}

			return transaction
		}),

	create: protectedProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const asset = await prisma.asset.findUnique({
				where: {
					id: input.assetId,
					portfolio: {
						userId: ctx.user.id,
					},
				},
			})

			if (!asset) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Asset not found',
				})
			}

			const transaction = await prisma.transaction.create({
				data: {
					asset: {
						connect: {
							id: input.assetId,
						},
					},
					transactionType: input.transactionType,
					quantity: input.quantity,
					price: input.price,
					date: input.date,
				},
			})

			return transaction
		}),

	update: protectedProcedure
		.input(updateSchema)
		.mutation(async ({ input, ctx }) => {
			const transaction = await prisma.transaction.update({
				where: {
					id: input.id,
					asset: {
						portfolio: {
							userId: ctx.user.id,
						},
					},
				},
				data: {
					transactionType: input.transactionType,
					quantity: input.quantity,
					price: input.price,
					date: input.date,
				},
			})

			return transaction
		}),

	delete: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			await prisma.transaction.delete({
				where: {
					id: input,
					asset: {
						portfolio: {
							userId: ctx.user.id,
						},
					},
				},
			})
		}),
})

export type TransactionRouter = typeof transactionRouter
export type TransactionRouterInput = inferRouterInputs<TransactionRouter>
export type TransactionRouterOutput = inferRouterOutputs<TransactionRouter>
