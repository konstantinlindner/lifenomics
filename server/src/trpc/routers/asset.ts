import {
	assetCreateSchema,
	assetUpdateSchema,
	idSchema,
} from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'

import {
	TRPCError,
	type inferRouterInputs,
	type inferRouterOutputs,
} from '@trpc/server'

import { protectedProcedure, router } from '../trpc'

export const asset = router({
	getAll: protectedProcedure.query(async () => {
		return await prisma.asset.findMany({
			orderBy: {
				name: 'desc',
			},
		})
	}),

	getByPortfolioId: protectedProcedure
		.input(idSchema)
		.query(async ({ input, ctx }) => {
			const portfolio = await prisma.portfolio.findUnique({
				where: {
					id: input,
					userId: ctx.user.id,
				},
			})

			if (!portfolio) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Portfolio not found',
				})
			}

			return await prisma.asset.findMany({
				where: {
					portfolios: {
						some: {
							id: portfolio.id,
						},
					},
				},
			})
		}),

	getById: protectedProcedure
		.input(idSchema)
		.query(async ({ input, ctx }) => {
			return await prisma.asset.findUnique({
				where: {
					id: input,
				},
				include: {
					portfolios: {
						where: {
							userId: ctx.user.id,
						},
					},
					transactions: {
						where: {
							userId: ctx.user.id,
						},
					},
				},
			})
		}),

	getByIdWithTransactions: protectedProcedure
		.input(idSchema)
		.query(async ({ input, ctx }) => {
			return await prisma.asset.findUnique({
				where: {
					id: input,
				},
				include: {
					transactions: {
						where: {
							userId: ctx.user.id,
						},
					},
				},
			})
		}),

	create: protectedProcedure
		.input(assetCreateSchema)
		.mutation(async ({ input }) => {
			const {
				exchangeId,
				portfolioIds,
				transactionIds,
				type,
				ticker,
				sectorIds,
				name,
				description,
				imageUrl,
			} = input

			return await prisma.asset.create({
				data: {
					exchangeId,
					portfolios: {
						connect: portfolioIds?.map((id) => ({
							id,
						})),
					},
					transactions: {
						connect: transactionIds?.map((id) => ({
							id,
						})),
					},
					type,
					ticker,
					sectors: {
						connect: sectorIds?.map((id) => ({
							id,
						})),
					},
					name,
					description,
					imageUrl,
				},
			})
		}),

	update: protectedProcedure
		.input(assetUpdateSchema)
		.mutation(async ({ input }) => {
			const {
				id,
				exchangeId,
				portfolioIds,
				transactionIds,
				type,
				ticker,
				sectorIds,
				name,
				description,
				imageUrl,
			} = input

			return await prisma.asset.update({
				where: {
					id,
				},
				data: {
					exchangeId,
					portfolios: {
						connect: portfolioIds?.map((id) => ({
							id,
						})),
					},
					transactions: {
						connect: transactionIds?.map((id) => ({
							id,
						})),
					},
					type,
					ticker,
					sectors: {
						connect: sectorIds?.map((id) => ({
							id,
						})),
					},
					name,
					description,
					imageUrl,
				},
			})
		}),

	delete: protectedProcedure.input(idSchema).mutation(async ({ input }) => {
		await prisma.asset.delete({
			where: {
				id: input,
			},
		})
	}),
})

export type AssetRouter = typeof asset
export type AssetRouterInput = inferRouterInputs<AssetRouter>
export type AssetRouterOutput = inferRouterOutputs<AssetRouter>
