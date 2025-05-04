import { TRPCError, initTRPC } from '@trpc/server'
import { ZodError } from 'zod'

import { Context } from './context'

const t = initTRPC.context<Context>().create({
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ?
						error.cause.flatten()
					:	null,
			},
		}
	},
})

export const router = t.router
export const publicProcedure = t.procedure

const isAdminMiddleware = t.middleware(({ ctx, next }) => {
	if (ctx.user?.role !== 'admin') {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next({ ctx: { user: ctx.user } })
})

export const adminProcedure = t.procedure.use(isAdminMiddleware)

const protectedMiddleware = t.middleware(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next({ ctx: { user: ctx.user } })
})

export const protectedProcedure = t.procedure.use(protectedMiddleware)
