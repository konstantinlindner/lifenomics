import {
	id,
	transactionCreate,
	transactionUpdate,
} from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'

import {
	TRPCError,
	type inferRouterInputs,
	type inferRouterOutputs,
} from '@trpc/server'

import { protectedProcedure, router } from '../trpc'

export const transaction = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		return await prisma.transaction.findMany({
			where: {
				userId: ctx.user.id,
			},
			orderBy: {
				timestamp: 'desc',
			},
		})
	}),

	getById: protectedProcedure.input(id).query(async ({ input, ctx }) => {
		return await prisma.transaction.findUnique({
			where: {
				id: input,
				userId: ctx.user.id,
			},
		})
	}),

	create: protectedProcedure
		.input(transactionCreate)
		.mutation(async ({ input, ctx }) => {
			const { assetId, transactionType, quantity, price, timestamp } =
				input

			const asset = await prisma.asset.findUnique({
				where: {
					id: assetId,
				},
			})

			if (!asset) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Asset not found',
				})
			}

			return await prisma.transaction.create({
				data: {
					asset: {
						connect: {
							id: asset.id,
						},
					},
					user: {
						connect: {
							id: ctx.user.id,
						},
					},
					transactionType,
					quantity,
					price,
					timestamp,
				},
			})
		}),

	update: protectedProcedure
		.input(transactionUpdate)
		.mutation(async ({ input, ctx }) => {
			const { id, transactionType, quantity, price, timestamp } = input

			return await prisma.transaction.update({
				where: {
					userId: ctx.user.id,
					id,
				},
				data: {
					transactionType,
					quantity,
					price,
					timestamp,
				},
			})
		}),

	delete: protectedProcedure.input(id).mutation(async ({ input, ctx }) => {
		await prisma.transaction.delete({
			where: {
				userId: ctx.user.id,
				id: input,
			},
		})
	}),
})

export type TransactionRouter = typeof transaction
export type TransactionRouterInput = inferRouterInputs<TransactionRouter>
export type TransactionRouterOutput = inferRouterOutputs<TransactionRouter>
