import { asset, exchange, transaction, user } from './routers'
import { router } from './trpc'

export const appRouter = router({
	asset,
	exchange,
	transaction,
	user,
})

export type AppRouter = typeof appRouter
