import { Link } from '@tanstack/react-router'

import { ServerCrashIcon } from 'lucide-react'

import { Button } from '~/components/ui'

export function NotFound() {
	return (
		<main id='error-page'>
			<section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
				<div className='container flex max-w-[64rem] flex-col items-center gap-4 text-center'>
					<ServerCrashIcon className='size-16' />
					<h1 className='font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>
						404 - Page not found
					</h1>
					<p className='text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8'>
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
