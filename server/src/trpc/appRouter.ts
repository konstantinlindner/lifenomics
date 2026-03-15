import { portfolio, stock, user, watchlist } from './routers'
import { router } from './trpc'

export const appRouter = router({
	portfolio,
	stock,
	user,
	watchlist,
})

export type AppRouter = typeof appRouter
