import { Link } from '@tanstack/react-router'

import { ServerCrashIcon } from 'lucide-react'

import { Button } from '~/components/ui'

export function NotFound() {
	return (
		<main
			id='error-page'
			className='flex min-h-screen flex-col items-center justify-center'
		>
			<section className='w-full max-w-5xl space-y-6 px-4 text-center'>
				<div className='flex flex-col items-center gap-4'>
					<ServerCrashIcon className='size-16' />
					<h1 className='font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>
						404 - Page not found
					</h1>
					<p className='max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
						The page you are looking for does not exist.
					</p>
					<Link to={`/`}>
						<Button size='lg' className='mt-6'>
							Home
						</Button>
					</Link>
				</div>
			</section>
		</main>
	)
}
