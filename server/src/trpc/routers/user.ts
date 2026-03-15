import { id, userUpdate } from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'

import {
	TRPCError,
	type inferRouterInputs,
	type inferRouterOutputs,
} from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

export const user = router({
	get: protectedProcedure.query(async ({ ctx }) => {
		const user = await prisma.user.findUnique({
			where: {
				id: ctx.user.id,
			},
			select: {
				firstName: true,
				lastName: true,
				email: true,
				birthDate: true,
				avatarUrl: true,
				role: true,
				createdAt: true,
			},
		})

		if (!user) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'No user found with that ID',
			})
		}

		return user
	}),

	update: protectedProcedure
		.input(userUpdate)
		.mutation(async ({ input, ctx }) => {
			const user = await prisma.user.update({
				where: {
					id: ctx.user.id,
				},
				data: {
					...input,
				},
			})

			return user
		}),

	updateAvatar: protectedProcedure
		.input(z.object({ avatarUrl: z.url() }))
		.mutation(async ({ input, ctx }) => {
			return await prisma.user.update({
				where: {
					id: ctx.user.id,
				},
				data: {
					avatarUrl: input.avatarUrl,
				},
			})
		}),

	getById: protectedProcedure.input(id).query(async ({ input }) => {
		const user = await prisma.user.findUnique({
			where: {
				id: input,
			},
			select: {
				firstName: true,
				lastName: true,
			},
		})

		if (!user) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'User not found',
			})
		}

		return user
	}),
})

export type UserRouter = typeof user
export type UserRouterInput = inferRouterInputs<UserRouter>
export type UserRouterOutput = inferRouterOutputs<UserRouter>

export type User = UserRouterOutput['get']
