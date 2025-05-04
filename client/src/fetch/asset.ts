import { AssetRouterInput } from '@/server/trpc/routers/assetRouter'

import { TRPCClient } from '@/clients'
import { log } from '@/helpers'

export async function getAssets(portfolioId?: number) {
	return await TRPCClient.assetRouter.getAll.query(portfolioId)
}

export async function getAssetById(id: number) {
	return await TRPCClient.assetRouter.getById.query(id)
}

export async function getAssetByIdWithTransactions(id: number) {
	return await TRPCClient.assetRouter.getByIdWithTransactions.query(id)
}

export async function createAsset(params: AssetRouterInput['create']) {
	try {
		return await TRPCClient.assetRouter.create.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function updateAsset(params: AssetRouterInput['update']) {
	try {
		return await TRPCClient.assetRouter.update.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function deleteAsset(id: number) {
	try {
		return await TRPCClient.assetRouter.delete.mutate(id)
	} catch (error) {
		log(error)
		return null
	}
}
