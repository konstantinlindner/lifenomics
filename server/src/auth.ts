import { env } from '~/env'

import { prisma } from '~/prisma'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { sendEmail } from '~/utils/email'

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.BETTER_AUTH_URL, env.FRONTEND_URL],
	advanced: {
		cookiePrefix: 'lifenomics',
		database: {
			useNumberId: true,
			generateId: false,
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				text: `Click the link to verify your email: ${url}`,
				verifyUrl: url,
				userName: user.name,
			})
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 12,
		autoSignIn: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Reset your password',
				text: `Click the link to reset your password: ${url}`,
				resetUrl: url,
				userName: user.name,
			})
		},
		onPasswordReset: async ({ user }) => {
			await sendEmail({
				to: user.email,
				subject: 'Password reset successful',
				text: 'Your password has been reset successfully.',
				userName: user.name,
			})
			console.log(`Password for user ${user.email} has been reset.`)
		},
	},
	appName: 'Lifenomics',
	user: {
		additionalFields: {
			firstName: { type: 'string', required: true },
			lastName: { type: 'string', required: true },
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: false,
			},
			birthDate: { type: 'date', required: false },
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
				await sendEmail({
					to: user.email,
					subject: 'Confirm your email change',
					text: `You requested to change your email to ${newEmail}. Click to confirm: ${url}`,
					confirmUrl: url,
					newEmail,
					userName: user.name,
				})
			},
		},
		deleteUser: { enabled: true },
		fields: { image: 'avatarUrl' },
	},
})
