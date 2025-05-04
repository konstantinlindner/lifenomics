import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export async function invalidateQuery(
	queryKey: (string | number | undefined)[],
) {
	await queryClient.invalidateQueries({ queryKey })
}
