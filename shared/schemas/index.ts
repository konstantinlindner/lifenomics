import { z } from 'zod'

// General
export const idSchema = z.number().int().positive()
export type Id = z.infer<typeof idSchema>

export const idArraySchema = z.array(idSchema)
export type IdArray = z.infer<typeof idArraySchema>

export const practicalStringSchema = z.string().trim().min(2)
export type PracticalString = z.infer<typeof practicalStringSchema>

// Asset
export const assetType = z.enum(['stock', 'crypto', 'forex', 'commodity'])
export type AssetType = z.infer<typeof assetType>

export const assetCreateSchema = z.object({
	exchangeId: idSchema,
	portfolioIds: idArraySchema.optional(),
	transactionIds: idArraySchema.optional(),
	type: assetType,
	ticker: practicalStringSchema,
	sectorIds: idArraySchema.optional(),
	name: practicalStringSchema,
	description: practicalStringSchema.optional(),
	imageUrl: practicalStringSchema.optional(),
})
export type AssetCreate = z.infer<typeof assetCreateSchema>

export const assetUpdateSchema = z.object({
	id: idSchema,
	portfolioIds: idArraySchema.optional(),
	transactionIds: idArraySchema.optional(),
	exchangeId: idSchema.optional(),
	type: assetType.optional(),
	ticker: practicalStringSchema.optional(),
	sectorIds: idArraySchema.optional(),
	name: practicalStringSchema.optional(),
	description: practicalStringSchema.optional(),
	imageUrl: practicalStringSchema.optional(),
})
export type AssetUpdate = z.infer<typeof assetUpdateSchema>

// Exchange
export const exchangeCreateSchema = z.object({
	assetIds: idArraySchema.optional(),
	country: practicalStringSchema,
	city: practicalStringSchema,
	website: practicalStringSchema,
	currencyId: idSchema,
	name: practicalStringSchema,
	shortName: practicalStringSchema,
	timezoneName: practicalStringSchema,
	timezoneShortName: practicalStringSchema,
})
export type ExchangeCreate = z.infer<typeof exchangeCreateSchema>

export const exchangeUpdateSchema = z.object({
	id: idSchema,
	assetIds: idArraySchema.optional(),
	country: practicalStringSchema.optional(),
	city: practicalStringSchema.optional(),
	website: practicalStringSchema.optional(),
	currencyId: idSchema.optional(),
	name: practicalStringSchema.optional(),
	shortName: practicalStringSchema.optional(),
	timezoneName: practicalStringSchema.optional(),
	timezoneShortName: practicalStringSchema.optional(),
})
export type ExchangeUpdate = z.infer<typeof exchangeUpdateSchema>

// Portfolio
export const portfolioCreateSchema = z.object({
	assetIds: idArraySchema.optional(),
	name: practicalStringSchema,
	comment: practicalStringSchema.optional(),
})
export type PortfolioCreate = z.infer<typeof portfolioCreateSchema>

export const portfolioUpdateSchema = z.object({
	id: idSchema,
	assetIds: idArraySchema.optional(),
	name: practicalStringSchema.optional(),
	comment: practicalStringSchema.optional(),
})
export type PortfolioUpdate = z.infer<typeof portfolioUpdateSchema>

// Transaction
export const transactionTypeSchema = z.enum(['purchase', 'sale'])

export const transactionCreateSchema = z.object({
	assetId: idSchema,
	transactionType: transactionTypeSchema,
	quantity: z.number(),
	price: z.number(),
	timestamp: z.date(),
})
export type TransactionCreate = z.infer<typeof transactionCreateSchema>

export const transactionUpdateSchema = z.object({
	id: idSchema,
	assetId: idSchema.optional(),
	transactionType: transactionTypeSchema.optional(),
	quantity: z.number().optional(),
	price: z.number().optional(),
	timestamp: z.date().optional(),
})
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>

// User
export const signInSchema = z.object({
	email: z.string().trim().email('Please enter a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})
export type SignIn = z.infer<typeof signInSchema>

export const signUpSchema = signInSchema.extend({
	firstName: z
		.string()
		.trim()
		.min(2, 'First name must be at least 2 characters long'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
})
export type SignUp = z.infer<typeof signUpSchema>
export const userUpdateSchema = z.object({
	email: z.string().trim().email().optional(),
	password: z.string().min(8).optional(),
	firstName: z.string().trim().min(2).optional(),
	lastName: z.string().trim().min(2).optional(),
	birthDate: z.date().optional(),
	avatarUrl: z.string().trim().optional(),
})
export type UserUpdate = z.infer<typeof userUpdateSchema>
