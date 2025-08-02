import { createContext } from 'react'

import type { User } from '@server/trpc/routers/user'

export type UserContextState = {
	user: User | null
	isPending: boolean
}

const initialState: UserContextState = {
	user: null,
	isPending: true,
}

export const UserContext = createContext<UserContextState>(initialState)
