import { auth } from '~/auth'
import { prisma } from '~/prisma'

import type { User } from '@prisma/client'
import { Request, Response } from '@tinyhttp/app'
import { fromNodeHeaders } from 'better-auth/node'

type CreateContextReturn = {
	prisma: typeof prisma
	user: User | null
	res: Response
}

export async function createContext(args: {
	req: Request
	res: Response
}): Promise<CreateContextReturn> {
	const user = await getUser(args.req)

	return {
		prisma,
		user,
		res: args.res,
	}
}

async function getUser(req: Request): Promise<User | null> {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(
			req.headers as Record<string, string | string[] | undefined>,
		),
	})

	if (!session?.user?.id) {
		return null
	}

	const userId =
		typeof session.user.id === 'number' ?
			session.user.id
		:	Number(session.user.id)

	if (Number.isNaN(userId)) return null

	return await prisma.user.findUnique({
		where: {
			id: userId,
		},
	})
}

export type Context = Awaited<ReturnType<typeof createContext>>
