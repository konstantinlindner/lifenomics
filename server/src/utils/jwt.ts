import { env } from '~/env'

import jwt from 'jsonwebtoken'
import { z } from 'zod'

export function signJwt(userId: number) {
	const jwtSecret = env.JWT_SECRET

	return jwt.sign({ userId }, jwtSecret, {
		expiresIn: '30d',
	})
}

export function verifyJwt(token: string) {
	const decoded = z
		.object({ userId: z.number() })
		.safeParse(jwt.verify(token, env.JWT_SECRET))

	if (!decoded.success) {
		return null
	}

	return decoded.data.userId
}
