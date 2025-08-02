import { env } from '~/env'

import {
	idSchema,
	signInSchema,
	signUpSchema,
	userUpdateSchema,
} from '@lifenomics/shared/schemas'

import { prisma } from '~/prisma'
import { hashPassword, isPasswordMatch, signJwt } from '~/utils'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
	TRPCError,
	type inferRouterInputs,
	type inferRouterOutputs,
} from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'

export const user = router({
	signIn: publicProcedure
		.input(signInSchema)
		.mutation(async ({ input, ctx }) => {
			const { email, password } = input

			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (!user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'No user found with that email',
				})
			}

			const passwordsMatch = await isPasswordMatch(
				user.password,
				password,
			)

			if (!passwordsMatch) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Incorrect password',
				})
			}

			const token = signJwt(user.id)

			ctx.res.cookie('ln_session_token', token, {
				httpOnly: true,
				secure: env.NODE_ENV !== 'development',
				sameSite: 'strict',
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
		}),

	signUp: publicProcedure
		.input(signUpSchema)
		.mutation(async ({ input, ctx }) => {
			const { firstName, lastName, email, password } = input

			const existingUser = await ctx.prisma.user.findUnique({
				where: { email: input.email },
			})

			if (existingUser) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'User already exists',
				})
			}

			const hashedPassword = await hashPassword(password)

			const user = await prisma.user.create({
				data: {
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: hashedPassword,
				},
			})

			const token = signJwt(user.id)

			ctx.res.cookie('ln_session_token', token, {
				httpOnly: true,
				secure: env.NODE_ENV !== 'development',
				sameSite: 'strict',
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
		}),

	signOut: protectedProcedure.mutation(({ ctx }) => {
		ctx.res.clearCookie('ln_session_token')
	}),

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
		.input(userUpdateSchema)
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

	getProfileImageUploadUrl: protectedProcedure
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const putObjectCommand = new PutObjectCommand({
				Bucket: env.AWS_S3_BUCKET_NAME,
				Key: `profile-images/${ctx.user.id}/${input}`,
			})

			return await getSignedUrl(ctx.s3, putObjectCommand)
		}),

	getProfileImageFolderUrl: protectedProcedure.query(({ ctx }) => {
		const imageUrl = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/profile-images/${ctx.user.id}/`

		return imageUrl
	}),

	getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
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

export type SignInInput = UserRouterInput['signIn']
export type SignUpInput = UserRouterInput['signUp']

export type User = UserRouterOutput['get']
