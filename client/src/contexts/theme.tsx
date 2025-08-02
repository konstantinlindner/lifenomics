import { createContext } from 'react'

import type { Theme } from '~/providers'

type State = {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const initialState: State = {
	theme: 'system',
	setTheme: () => null,
}

export const ThemeContext = createContext<State>(initialState)
