import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { router } from '../trpc'
import { assetRouter } from './assetRouter'
import { portfolioRouter } from './portfolioRouter'
import { transactionRouter } from './transactionRouter'
import { userRouter } from './userRouter'

export const appRouter = router({
	assetRouter,
	portfolioRouter,
	transactionRouter,
	userRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInput = inferRouterInputs<AppRouter>
export type AppRouterOutput = inferRouterOutputs<AppRouter>
