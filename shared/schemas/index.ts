import { z } from 'zod'

// Utilities
export const string = z
	.string()
	.trim()
	.min(2, { error: 'Must be at least 2 characters' })
export const positiveInt = z.number().int().positive()
export const defaultFalseBoolean = z.boolean().default(false)
export const id = positiveInt
export const email = z.email({ error: 'Must be a valid email address' })
// Matches min. password length in auth.ts
export const password = z
	.string()
	.min(12, { error: 'Password must be at least 12 characters long' })
export const url = z.url({ error: 'Must be a valid URL' })

// Portfolio position (symbol-based, no DB Stock required)
export const positionCreate = z.object({
	symbol: z.string().min(1).max(20),
	quantity: z.number().positive(),
	averagePurchasePrice: z.number().positive(),
	currency: z.string().min(1).max(10),
})
export type PositionCreate = z.infer<typeof positionCreate>

export const positionUpdate = z.object({
	id: id,
	quantity: z.number().positive().optional(),
	averagePurchasePrice: z.number().positive().optional(),
	currency: z.string().min(1).max(10).optional(),
})
export type PositionUpdate = z.infer<typeof positionUpdate>

// User
export const userSignIn = z.object({
	email: email,
	password: password,
})
export type UserSignIn = z.infer<typeof userSignIn>

export const userSignUp = userSignIn.extend({
	firstName: string,
	lastName: string,
})
export type UserSignUp = z.infer<typeof userSignUp>

export const userUpdate = z
	.object({
		firstName: string,
		lastName: string,
		birthDate: z.date().optional(),
		avatarUrl: url.optional(),
		email: email,
		// allow empty string (default value) on submit
		currentPassword: z.union([password, z.literal('')]).optional(),
		newPassword: z.union([password, z.literal('')]).optional(),
		confirmPassword: z.union([password, z.literal('')]).optional(),
	})
	.refine(
		(data) => {
			if (data.newPassword && data.newPassword !== data.confirmPassword) {
				return false
			}
			return true
		},
		{
			error: "Passwords don't match",
			path: ['confirmPassword'],
		},
	)
	.refine(
		(data) => {
			// If updating password, current password is required
			if (data.newPassword && !data.currentPassword) {
				return false
			}
			return true
		},
		{
			error: 'Current password is required when changing password',
			path: ['currentPassword'],
		},
	)
export type UserUpdate = z.infer<typeof userUpdate>
