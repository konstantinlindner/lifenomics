import { TransactionRouterInput } from '@/server/trpc/routers/transactionRouter'

import { TRPCClient } from '@/clients'
import { log } from '@/helpers'

export async function getTransactions() {
	return await TRPCClient.transactionRouter.getAll.query()
}

export async function getTransactionById(id: number) {
	return await TRPCClient.transactionRouter.getById.query(id)
}

export async function createTransaction(
	params: TransactionRouterInput['create'],
) {
	try {
		return await TRPCClient.transactionRouter.create.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function updateTransaction(
	params: TransactionRouterInput['update'],
) {
	try {
		return await TRPCClient.transactionRouter.update.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function deleteTransaction(id: number) {
	try {
		return await TRPCClient.transactionRouter.delete.mutate(id)
	} catch (error) {
		log(error)
		return null
	}
}
