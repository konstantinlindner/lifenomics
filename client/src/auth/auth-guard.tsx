import { ReactNode } from 'react'

import { useUser } from '@/contexts'

import { Navigate } from 'react-router-dom'

import { LoadingIndicator } from '@/components'

type AuthGuardProps = {
	auth: 'Require' | 'Forbid' | 'None'
	children: ReactNode
}

export function AuthGuard({ auth, children }: AuthGuardProps) {
	const { user, isPending } = useUser()

	if (auth === 'Require') {
		if (isPending) {
			return (
				<div className='flex min-h-screen w-full items-center justify-center'>
					<LoadingIndicator size='lg' />
				</div>
			)
		}

		if (!user) {
			return <Navigate to='/sign-in' replace />
		}

		return children
	}

	if (auth === 'Forbid') {
		if (user) {
			return <Navigate to='/' replace />
		}

		return children
	}

	return children
}
