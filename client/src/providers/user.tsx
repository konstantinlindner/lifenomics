import type { FC, ReactNode } from 'react'

import { trpc } from '~/clients'
import { UserContext } from '~/contexts'

import { useQuery } from '@tanstack/react-query'

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { data: user, isPending } = useQuery(trpc.user.get.queryOptions())

	return (
		<UserContext.Provider value={{ user: user ?? null, isPending }}>
			{children}
		</UserContext.Provider>
	)
}
