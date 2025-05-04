import { PortfolioRouterInput } from '@/server/trpc/routers/portfolioRouter'

import { TRPCClient } from '@/clients'
import { log } from '@/helpers'

export async function getPortfolios() {
	return await TRPCClient.portfolioRouter.getAll.query()
}

export async function getPortfolioById(id: number) {
	return await TRPCClient.portfolioRouter.getById.query(id)
}

export async function getPortfolioByIdWithAssets(id: number) {
	return await TRPCClient.portfolioRouter.getByIdWithAssets.query(id)
}

export async function createPortfolio(params: PortfolioRouterInput['create']) {
	try {
		return await TRPCClient.portfolioRouter.create.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function updatePortfolio(params: PortfolioRouterInput['update']) {
	try {
		return await TRPCClient.portfolioRouter.update.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function deletePortfolio(id: number) {
	try {
		return await TRPCClient.portfolioRouter.delete.mutate(id)
	} catch (error) {
		log(error)
		return null
	}
}
