import { ReactNode } from 'react'

import { useUser } from '@/contexts'

import { Navigate } from 'react-router-dom'

import { LoadingIndicator } from '@/components'

type AdminGuardProps = {
	children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
	const { user, isPending } = useUser()

	if (isPending) {
		return (
			<div className='flex min-h-screen w-full items-center justify-center'>
				<LoadingIndicator size='lg' />
			</div>
		)
	}

	if (user?.role !== 'admin') {
		return <Navigate to='/' replace />
	}

	return children
}
