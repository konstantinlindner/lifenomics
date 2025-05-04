import { TRPCError, inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import prisma from 'src/prisma'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

const createSchema = z.object({
	portfolioId: z.number(),
	ticker: z.string(),
	transactionIds: z.array(z.number()).optional(),
})

const updateSchema = z.object({
	id: z.number(),
	portfolioId: z.number().optional(),
	ticker: z.string().optional(),
	transactionIds: z.array(z.number()).optional(),
})

export const assetRouter = router({
	// getAll: protectedProcedure.query(async ({ ctx }) => {
	// 	const assets = await prisma.asset.findMany({
	// 		where: {
	// 			portfolio: {
	// 				userId: ctx.user.id,
	// 			},
	// 		},
	// 		orderBy: {
	// 			createdAt: 'desc',
	// 		},
	// 	})

	// 	if (!assets.length) {
	// 		throw new TRPCError({
	// 			code: 'NOT_FOUND',
	// 			message: 'No assets found',
	// 		})
	// 	}

	// 	return assets
	// }),

	getAll: protectedProcedure
		.input(z.number().optional())
		.query(async ({ input, ctx }) => {
			const assets = await prisma.asset.findMany({
				where: {
					portfolioId: input,
					portfolio: {
						userId: ctx.user.id,
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			})

			return assets
		}),

	getById: protectedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			const asset = await prisma.asset.findUnique({
				where: {
					id: input,
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

			return asset
		}),

	getByIdWithTransactions: protectedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			const asset = await prisma.asset.findUnique({
				where: {
					id: input,
					portfolio: {
						userId: ctx.user.id,
					},
				},
				include: {
					transactions: true,
				},
			})

			if (!asset) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Asset not found',
				})
			}

			return asset
		}),

	create: protectedProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const portfolio = await prisma.portfolio.findUnique({
				where: {
					id: input.portfolioId,
					userId: ctx.user.id,
				},
			})

			if (!portfolio) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Portfolio not found',
				})
			}

			const asset = await prisma.asset.create({
				data: {
					portfolio: {
						connect: {
							id: input.portfolioId,
						},
					},
					ticker: input.ticker,
					transactions: {
						connect: input.transactionIds?.map((id) => ({
							id,
						})),
					},
				},
			})

			return asset
		}),

	update: protectedProcedure
		.input(updateSchema)
		.mutation(async ({ input, ctx }) => {
			const asset = await prisma.asset.update({
				where: {
					id: input.id,
					portfolio: {
						userId: ctx.user.id,
					},
				},
				data: {
					ticker: input.ticker,
					transactions: {
						connect: input.transactionIds?.map((id) => ({
							id,
						})),
					},
				},
			})

			return asset
		}),

	delete: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			await prisma.asset.delete({
				where: {
					id: input,
					portfolio: {
						userId: ctx.user.id,
					},
				},
			})
		}),
})

export type AssetRouter = typeof assetRouter
export type AssetRouterInput = inferRouterInputs<AssetRouter>
export type AssetRouterOutput = inferRouterOutputs<AssetRouter>
