import {
	id,
	portfolioCreate,
	portfolioUpdate,
} from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { protectedProcedure, router } from '../trpc'

export const portfolio = router({
	get: protectedProcedure.query(async ({ ctx }) => {
		return await prisma.portfolio.findMany({
			where: {
				userId: ctx.user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}),

	getById: protectedProcedure.input(id).query(async ({ input, ctx }) => {
		return await prisma.portfolio.findUnique({
			where: {
				id: input,
				userId: ctx.user.id,
			},
		})
	}),

	getByIdWithAssets: protectedProcedure
		.input(id)
		.query(async ({ input, ctx }) => {
			return await prisma.portfolio.findUnique({
				where: {
					id: input,
					userId: ctx.user.id,
				},
				include: {
					assets: true,
				},
			})
		}),

	create: protectedProcedure
		.input(portfolioCreate)
		.mutation(async ({ input, ctx }) => {
			const { assetIds, name, comment } = input

			return await prisma.portfolio.create({
				data: {
					assets: {
						connect: assetIds?.map((id) => ({
							id,
						})),
					},
					name,
					comment,
					user: {
						connect: {
							id: ctx.user.id,
						},
					},
				},
			})
		}),

	update: protectedProcedure
		.input(portfolioUpdate)
		.mutation(async ({ input, ctx }) => {
			const { id, assetIds, name, comment } = input

			return await prisma.portfolio.update({
				where: {
					id,
					userId: ctx.user.id,
				},
				data: {
					assets: {
						connect: assetIds?.map((id) => ({
							id,
						})),
					},
					name,
					comment,
				},
			})
		}),

	delete: protectedProcedure.input(id).mutation(async ({ input, ctx }) => {
		await prisma.portfolio.delete({
			where: {
				id: input,
				userId: ctx.user.id,
			},
		})
	}),
})

export type PortfolioRouter = typeof portfolio
export type PortfolioRouterInput = inferRouterInputs<PortfolioRouter>
export type PortfolioRouterOutput = inferRouterOutputs<PortfolioRouter>
