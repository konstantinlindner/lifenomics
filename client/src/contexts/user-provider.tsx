import { FC, ReactNode, createContext, useContext } from 'react'

import { User } from '@/server/trpc/routers/userRouter'

import { getUser } from '@/fetch'

import { useQuery } from '@tanstack/react-query'

type UserProviderProps = {
	user?: User
	isPending: boolean
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const UserContext = createContext<UserProviderProps>(undefined!)

export const useUser = () => useContext(UserContext)

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { isPending, data: user } = useQuery({
		queryKey: ['getUser'],
		queryFn: getUser,
	})

	return (
		<UserContext.Provider value={{ user: user, isPending: isPending }}>
			{children}
		</UserContext.Provider>
	)
}
