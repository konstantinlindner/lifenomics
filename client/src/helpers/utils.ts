import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function log(error: unknown) {
	// don't log in production
	if (!import.meta.env.DEV) {
		return
	}

	// eslint-disable-next-line no-console
	console.log(error)
}
