import { asset, exchange, portfolio, transaction, user } from './routers'
import { router } from './trpc'

export const appRouter = router({
	asset,
	exchange,
	portfolio,
	transaction,
	user,
})

export type AppRouter = typeof appRouter
