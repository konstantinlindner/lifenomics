import { TRPCError, inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import prisma from 'src/prisma'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

const createSchema = z.object({
	name: z.string().trim().min(2),
	comment: z.string().trim().optional(),
})

const updateSchema = z.object({
	id: z.number(),
	name: z.string().trim().min(2).optional(),
	comment: z.string().trim().optional(),
	assetIds: z.array(z.number().int().positive()).optional(),
})

export const portfolioRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const portfolios = await prisma.portfolio.findMany({
			where: {
				userId: ctx.user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		if (!portfolios.length) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'No portfolios found',
			})
		}

		return portfolios
	}),

	getById: protectedProcedure
		.input(z.number())
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

			return portfolio
		}),

	getByIdWithAssets: protectedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			const portfolio = await prisma.portfolio.findUnique({
				where: {
					id: input,
					userId: ctx.user.id,
				},
				include: {
					assets: true,
				},
			})

			if (!portfolio) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Portfolio not found',
				})
			}

			return portfolio
		}),

	create: protectedProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const portfolio = await prisma.portfolio.create({
				data: {
					name: input.name,
					comment: input.comment,
					user: {
						connect: {
							id: ctx.user.id,
						},
					},
				},
			})

			return portfolio
		}),

	update: protectedProcedure
		.input(updateSchema)
		.mutation(async ({ input, ctx }) => {
			const portfolio = await prisma.portfolio.update({
				where: {
					id: input.id,
					userId: ctx.user.id,
				},
				data: {
					name: input.name,
					comment: input.comment,
					assets: {
						connect: input.assetIds?.map((id) => ({
							id,
						})),
					},
				},
			})

			return portfolio
		}),

	delete: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			await prisma.portfolio.delete({
				where: {
					id: input,
					userId: ctx.user.id,
				},
			})
		}),
})

export type PortfolioRouter = typeof portfolioRouter
export type PortfolioRouterInput = inferRouterInputs<PortfolioRouter>
export type PortfolioRouterOutput = inferRouterOutputs<PortfolioRouter>
