import { hash, verify } from 'argon2'

export function hashPassword(password: string) {
	return hash(password)
}

export function isPasswordMatch(hashedPassword: string, password: string) {
	return verify(hashedPassword, password)
}
