import { queryClient } from '~/clients'

import type { QueryKey } from '@tanstack/react-query'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function log(message?: unknown, ...optionalParams: unknown[]) {
	// don't log in production
	if (!import.meta.env.DEV) {
		return
	}

	// eslint-disable-next-line no-console
	console.log(message, ...optionalParams)
}

export async function invalidateQuery(queryKey: QueryKey) {
	await queryClient.invalidateQueries({ queryKey })
}

export async function sleep(ms: number) {
	// eslint-disable-next-line no-promise-executor-return
	return new Promise((resolve) => setTimeout(resolve, ms))
}
