import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { TRPCError, inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { env } from 'src/env'
import prisma from 'src/prisma'
import { hashPassword, isPasswordMatch } from 'src/utils/argon2'
import { signJwt } from 'src/utils/jwt'
import { z } from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'

const signInSchema = z.object({
	email: z.string().trim().email('Please enter a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

const signUpSchema = signInSchema.extend({
	firstName: z
		.string()
		.trim()
		.min(2, 'First name must be at least 2 characters long'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
})

const updateSchema = z.object({
	email: z.string().trim().email().optional(),
	password: z.string().min(8).optional(),
	firstName: z.string().trim().min(2).optional(),
	lastName: z.string().trim().min(2).optional(),
	birthDate: z.date().optional(),
	avatarUrl: z.string().trim().optional(),
})

export const userRouter = router({
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

			ctx.res.cookie('ln_session_token', token, { httpOnly: true })
		}),

	signUp: publicProcedure
		.input(signUpSchema)
		.mutation(async ({ input, ctx }) => {
			const { firstName, lastName, email, password } = input

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

			ctx.res.cookie('ln_session_token', token, { httpOnly: true })
		}),

	signOut: protectedProcedure.mutation(({ ctx }) => {
		ctx.res.clearCookie('ln_session_token')
	}),

	getUser: protectedProcedure.query(async ({ ctx }) => {
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
		.input(updateSchema)
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

	getById: protectedProcedure.input(z.number()).query(async ({ input }) => {
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

export type UserRouter = typeof userRouter
export type UserRouterInput = inferRouterInputs<UserRouter>
export type UserRouterOutput = inferRouterOutputs<UserRouter>

export type SignInInput = UserRouterInput['signIn']
export type SignUpInput = UserRouterInput['signUp']

export type User = UserRouterOutput['getUser']
