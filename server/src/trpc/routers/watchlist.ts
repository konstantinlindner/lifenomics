import { prisma } from '~/prisma'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

const symbolInput = z.object({
	symbol: z.string().min(1).max(20),
})

export const watchlist = router({
	getStarred: protectedProcedure.query(async ({ ctx }) => {
		return await prisma.starredSymbol.findMany({
			where: { userId: ctx.user.id },
			orderBy: { symbol: 'asc' },
			select: { symbol: true },
		})
	}),

	toggleStarred: protectedProcedure
		.input(symbolInput)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.user.id
			const existing = await prisma.starredSymbol.findUnique({
				where: {
					userId_symbol: {
						userId,
						symbol: input.symbol,
					},
				},
			})

			if (existing) {
				await prisma.starredSymbol.delete({
					where: {
						userId_symbol: {
							userId,
							symbol: input.symbol,
						},
					},
				})
				return { starred: false }
			}

			await prisma.starredSymbol.create({
				data: {
					userId,
					symbol: input.symbol,
				},
			})
			return { starred: true }
		}),

	isStarred: protectedProcedure
		.input(symbolInput)
		.query(async ({ input, ctx }) => {
			const row = await prisma.starredSymbol.findUnique({
				where: {
					userId_symbol: {
						userId: ctx.user.id,
						symbol: input.symbol,
					},
				},
			})
			return !!row
		}),
})

export type WatchlistRouter = typeof watchlist
export type WatchlistRouterInput = inferRouterInputs<WatchlistRouter>
export type WatchlistRouterOutput = inferRouterOutputs<WatchlistRouter>
