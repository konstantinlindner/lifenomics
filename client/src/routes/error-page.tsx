import { Link, useRouteError } from 'react-router-dom'

import { ServerCrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

// todo error type narrowing
function isErrorWithStatus(error: unknown): error is { status: number } {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		typeof (error as { status: unknown }).status === 'number'
	)
}

export function ErrorPage() {
	const error = useRouteError()

	const is404Error = isErrorWithStatus(error) && error.status === 404

	return (
		<main id='error-page'>
			<section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
				<div className='container flex max-w-[64rem] flex-col items-center gap-4 text-center'>
					<ServerCrashIcon className='size-16' />
					<h1 className='font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>
						{is404Error && 'Not found'}
						{' - '}
						{is404Error && error.status}
					</h1>
					<p className='text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8'>
						{is404Error && 'Sorry, this page does not exist.'}
					</p>
					<Link to={`/`}>
						<Button size='lg' className='mt-6'>
							Go back home
						</Button>
					</Link>
				</div>
			</section>
		</main>
	)
}
