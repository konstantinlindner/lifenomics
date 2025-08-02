import { prisma } from '~/prisma'
import { s3 } from '~/s3'
import { verifyJwt } from '~/utils'

import type { User } from '@prisma/client'
import { Request, Response } from '@tinyhttp/app'
import { z } from 'zod'

type CreateContextReturn = {
	prisma: typeof prisma
	s3: typeof s3
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
		s3,
		user,
		res: args.res,
	}
}

async function getUser(req: Request) {
	const sessionToken = z.string().safeParse(req.cookies.ln_session_token)

	if (!sessionToken.success) {
		return null
	}

	const userId = verifyJwt(sessionToken.data)

	if (!userId) {
		return null
	}

	return await prisma.user.findUnique({
		where: {
			id: userId,
		},
	})
}

export type Context = Awaited<ReturnType<typeof createContext>>
