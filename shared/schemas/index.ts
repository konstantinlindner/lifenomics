import { z } from 'zod'

// Utilities
export const string = z.string().trim().min(2, 'Must be at least 2 characters')
export const positiveInt = z.number().int().positive()
export const defaultFalseBoolean = z.boolean().default(false)
export const id = positiveInt
export const email = string.email('Must be a valid email address')
export const password = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
export const url = string.url('Must be a valid URL')

// Asset
export const assetType = z.enum(['stock', 'crypto', 'forex', 'commodity'])
export type AssetType = z.infer<typeof assetType>

export const assetClass = z.enum(['A', 'B', 'C'])
export type AssetClass = z.infer<typeof assetClass>

export const assetCreate = z.object({
	exchangeId: id,
	portfolioIds: z.array(id).optional(),
	transactionIds: z.array(id).optional(),
	industryId: id,
	tagIds: z.array(id).optional(),
	type: assetType,
	isin: string.optional(),
	ticker: string,
	name: string,
	shortName: string.optional(),
	class: assetClass.optional(),
	adr: z.boolean().optional(),
	description: string.optional(),
	imageUrl: string.optional(),
	website: url.optional(),
})
export type AssetCreate = z.infer<typeof assetCreate>

export const assetUpdate = z.object({
	id: id,
	exchangeId: id.optional(),
	portfolioIds: z.array(id).optional(),
	transactionIds: z.array(id).optional(),
	industryId: id.optional(),
	tagIds: z.array(id).optional(),
	type: assetType.optional(),
	isin: string.optional(),
	ticker: string.optional(),
	name: string.optional(),
	shortName: string.optional(),
	class: assetClass.optional(),
	adr: z.boolean().optional(),
	description: string.optional(),
	imageUrl: url.optional(),
	website: url.optional(),
})
export type AssetUpdate = z.infer<typeof assetUpdate>

// Exchange
export const exchangeCreate = z.object({
	currencyId: id,
	MIC: string,
	name: string,
	shortName: string.optional(),
	code: string.optional(),
	codeAlt: string.optional(),
	timezoneName: string,
	timezoneShortName: string.optional(),
	country: string,
	city: string,
	website: url,
	emoji: string,
})
export type ExchangeCreate = z.infer<typeof exchangeCreate>

export const exchangeUpdate = z.object({
	id: id,
	currencyId: id.optional(),
	MIC: string.optional(),
	name: string.optional(),
	shortName: string.optional(),
	code: string.optional(),
	codeAlt: string.optional(),
	timezoneName: string.optional(),
	timezoneShortName: string.optional(),
	country: string.optional(),
	city: string.optional(),
	website: url.optional(),
	emoji: string.optional(),
})
export type ExchangeUpdate = z.infer<typeof exchangeUpdate>

// Portfolio
export const portfolioCreate = z.object({
	assetIds: z.array(id).optional(),
	name: string,
	comment: string.optional(),
})
export type PortfolioCreate = z.infer<typeof portfolioCreate>

export const portfolioUpdate = z.object({
	id: id,
	assetIds: z.array(id).optional(),
	name: string.optional(),
	comment: string.optional(),
})
export type PortfolioUpdate = z.infer<typeof portfolioUpdate>

// Transaction
export const transactionType = z.enum(['purchase', 'sale'])

export const transactionCreate = z.object({
	assetId: id,
	transactionType: transactionType,
	quantity: z.number(),
	price: z.number(),
	timestamp: z.date(),
})
export type TransactionCreate = z.infer<typeof transactionCreate>

export const transactionUpdate = z.object({
	id: id,
	assetId: id.optional(),
	transactionType: transactionType.optional(),
	quantity: z.number().optional(),
	price: z.number().optional(),
	timestamp: z.date().optional(),
})
export type TransactionUpdate = z.infer<typeof transactionUpdate>

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
			message: "Passwords don't match",
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
			message: 'Current password is required when changing password',
			path: ['currentPassword'],
		},
	)
export type UserUpdate = z.infer<typeof userUpdate>
