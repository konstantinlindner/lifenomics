import { useNavigate } from 'react-router-dom'

import { ServerCrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ErrorItemProps = {
	error: Error
}

export function ErrorItem({ error }: ErrorItemProps) {
	const navigate = useNavigate()

	return (
		<section className='flex flex-col items-center justify-center gap-2'>
			<ServerCrashIcon className='size-16' />

			<h1 className='font-heading text-xl'>
				{error.message || 'Something went wrong'}
			</h1>
			<h2 className='text-sm'>Please try reloading the page.</h2>

			<Button onClick={() => navigate(0)}>Reload</Button>
		</section>
	)
}
