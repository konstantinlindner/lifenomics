import jwt from 'jsonwebtoken'
import { env } from 'src/env'

export function signJwt(userId: number) {
	const jwtSecret = env.JWT_SECRET

	return jwt.sign({ userId }, jwtSecret)
}

export function verifyJwt(token: string) {
	const jwtSecret = env.JWT_SECRET

	return jwt.verify(token, jwtSecret) as { userId: number } | null
}
