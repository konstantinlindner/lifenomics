import { assetCreate, assetUpdate, id } from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'

import {
	TRPCError,
	type inferRouterInputs,
	type inferRouterOutputs,
} from '@trpc/server'

import { protectedProcedure, router } from '../trpc'

export const asset = router({
	get: protectedProcedure.query(async () => {
		return await prisma.asset.findMany({
			orderBy: {
				name: 'desc',
			},
		})
	}),

	getOwned: protectedProcedure.query(async ({ ctx }) => {
		return await prisma.asset.findMany({
			where: {
				portfolios: {
					some: {
						userId: ctx.user.id,
					},
				},
			},
		})
	}),

	getByPortfolioId: protectedProcedure
		.input(id)
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

	getById: protectedProcedure.input(id).query(async ({ input, ctx }) => {
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

	create: protectedProcedure
		.input(assetCreate)
		.mutation(async ({ input }) => {
			const {
				exchangeId,
				portfolioIds,
				transactionIds,
				industryId,
				type,
				ticker,
				tagIds,
				shortName,
				class: class_,
				adr,
				isin,
				name,
				description,
				imageUrl,
				website,
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
					industryId,
					tags: {
						connect: tagIds?.map((id) => ({
							id,
						})),
					},
					type,
					isin,
					ticker,
					name,
					shortName,
					class: class_,
					adr,
					description,
					imageUrl,
					website,
				},
			})
		}),

	update: protectedProcedure
		.input(assetUpdate)
		.mutation(async ({ input }) => {
			const {
				id,
				exchangeId,
				portfolioIds,
				transactionIds,
				industryId,
				tagIds,
				type,
				isin,
				ticker,
				name,
				shortName,
				class: class_,
				adr,
				description,
				imageUrl,
				website,
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
					industryId,
					tags: {
						connect: tagIds?.map((id) => ({
							id,
						})),
					},
					type,
					isin,
					ticker,
					name,
					shortName,
					class: class_,
					adr,
					description,
					imageUrl,
					website,
				},
			})
		}),

	delete: protectedProcedure.input(id).mutation(async ({ input }) => {
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
