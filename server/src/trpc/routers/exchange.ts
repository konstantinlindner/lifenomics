import {
	exchangeCreateSchema,
	exchangeUpdateSchema,
	idSchema,
} from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { protectedProcedure, router } from '../trpc'

export const exchange = router({
	getAll: protectedProcedure.query(async () => {
		return await prisma.exchange.findMany({})
	}),

	getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
		return await prisma.exchange.findUnique({
			where: {
				id: input,
			},
		})
	}),

	create: protectedProcedure
		.input(exchangeCreateSchema)
		.mutation(async ({ input }) => {
			const {
				assetIds,
				country,
				city,
				website,
				currencyId,
				name,
				shortName,
				timezoneName,
				timezoneShortName,
			} = input

			return await prisma.exchange.create({
				data: {
					country,
					city,
					website,
					currency: {
						connect: {
							id: currencyId,
						},
					},
					assets: {
						connect: assetIds?.map((id) => ({
							id,
						})),
					},
					name,
					shortName,
					timezoneName,
					timezoneShortName,
				},
			})
		}),

	update: protectedProcedure
		.input(exchangeUpdateSchema)
		.mutation(async ({ input }) => {
			const {
				country,
				city,
				website,
				currencyId,
				id,
				assetIds,
				name,
				shortName,
				timezoneName,
				timezoneShortName,
			} = input

			return await prisma.exchange.update({
				where: {
					id,
				},
				data: {
					country,
					city,
					website,
					currency: {
						connect: {
							id: currencyId,
						},
					},
					assets: {
						connect: assetIds?.map((id) => ({
							id,
						})),
					},
					name,
					shortName,
					timezoneName,
					timezoneShortName,
				},
			})
		}),

	delete: protectedProcedure.input(idSchema).mutation(async ({ input }) => {
		await prisma.exchange.delete({
			where: {
				id: input,
			},
		})
	}),
})

export type ExchangeRouter = typeof exchange
export type ExchangeRouterInput = inferRouterInputs<ExchangeRouter>
export type ExchangeRouterOutput = inferRouterOutputs<ExchangeRouter>
