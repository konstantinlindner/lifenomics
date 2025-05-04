import { User } from '@prisma/client'
import { Request, Response } from 'express'
import prisma from 'src/prisma'
import { s3 } from 'src/s3'
import { verifyJwt } from 'src/utils/jwt'

type CreateContextProps = {
	req: Request
	res: Response
}

type CreateContextReturn = CreateContextProps & {
	prisma: typeof prisma
	s3: typeof s3
	user: User | null
}

export async function createContext({
	req,
	res,
}: CreateContextProps): Promise<CreateContextReturn> {
	const sessionToken = req.cookies['ln_session_token'] as string | undefined

	if (!sessionToken) {
		return {
			prisma,
			s3,
			user: null,
			req,
			res,
		}
	}

	const jwtPayload = verifyJwt(sessionToken)

	if (!jwtPayload?.userId) {
		return {
			prisma,
			s3,
			user: null,
			req,
			res,
		}
	}

	const user = await prisma.user.findUnique({
		where: {
			id: jwtPayload.userId,
		},
	})

	return {
		prisma,
		s3,
		user,
		req,
		res,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
