import type { AppRouter } from '@server/trpc'

import type { TRPCClientErrorLike } from '@trpc/client'

import { ServerCrashIcon } from 'lucide-react'

import { Button } from '~/components/ui'

type ErrorItemProps = {
	error: Error | TRPCClientErrorLike<AppRouter>
}

export function ErrorItem({ error }: ErrorItemProps) {
	return (
		<section className='flex flex-col items-center justify-center gap-2'>
			<ServerCrashIcon className='size-16' />

			<h1 className='font-heading text-xl'>
				{error.message || 'Something went wrong'}
			</h1>
			<h2 className='text-sm'>Please try reloading the page.</h2>

			<Button
				onClick={() => {
					window.location.reload()
				}}
			>
				Reload
			</Button>
		</section>
	)
}
