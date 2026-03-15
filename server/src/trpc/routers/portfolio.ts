import { id, positionCreate, positionUpdate } from '@lifenomics/shared/schemas'

import { getQuotes } from '~/finnhub'
import { prisma } from '~/prisma'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

const symbolInput = z.object({ symbol: z.string().min(1).max(20) })

export const portfolio = router({
	getPositionBySymbol: protectedProcedure
		.input(symbolInput)
		.query(async ({ input, ctx }) => {
			const position = await prisma.portfolioPosition.findUnique({
				where: {
					userId_symbol: {
						userId: ctx.user.id,
						symbol: input.symbol,
					},
				},
			})
			if (!position) return null
			return {
				...position,
				quantity: Number(position.quantity),
				averagePurchasePrice: Number(position.averagePurchasePrice),
			}
		}),

	getPositions: protectedProcedure.query(async ({ ctx }) => {
		const positions = await prisma.portfolioPosition.findMany({
			where: { userId: ctx.user.id },
			orderBy: { symbol: 'asc' },
		})

		const symbols = positions.map((p) => p.symbol)
		const quotes =
			symbols.length > 0 ? await getQuotes([...new Set(symbols)]) : {}

		return positions.map((position) => {
			const quote = quotes[position.symbol]
			const avg = Number(position.averagePurchasePrice)
			const current = quote?.current ?? null
			const changePercentSinceBought =
				current != null && avg > 0 ?
					((current - avg) / avg) * 100
				:	null

			return {
				...position,
				quantity: Number(position.quantity),
				averagePurchasePrice: avg,
				currentPrice: current,
				changePercentSinceBought,
			}
		})
	}),

	addPosition: protectedProcedure
		.input(positionCreate)
		.mutation(async ({ input, ctx }) => {
			return await prisma.portfolioPosition.upsert({
				where: {
					userId_symbol: {
						userId: ctx.user.id,
						symbol: input.symbol,
					},
				},
				create: {
					userId: ctx.user.id,
					symbol: input.symbol,
					quantity: input.quantity,
					averagePurchasePrice: input.averagePurchasePrice,
					currency: input.currency,
				},
				update: {
					quantity: input.quantity,
					averagePurchasePrice: input.averagePurchasePrice,
					currency: input.currency,
				},
			})
		}),

	updatePosition: protectedProcedure
		.input(positionUpdate)
		.mutation(async ({ input, ctx }) => {
			const { id, ...data } = input
			return await prisma.portfolioPosition.update({
				where: {
					id,
					userId: ctx.user.id,
				},
				data: {
					...(data.quantity != null && { quantity: data.quantity }),
					...(data.averagePurchasePrice != null && {
						averagePurchasePrice: data.averagePurchasePrice,
					}),
					...(data.currency != null && { currency: data.currency }),
				},
			})
		}),

	removePosition: protectedProcedure
		.input(id)
		.mutation(async ({ input, ctx }) => {
			await prisma.portfolioPosition.delete({
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
