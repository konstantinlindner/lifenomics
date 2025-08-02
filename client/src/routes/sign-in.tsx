import { Link, createFileRoute } from '@tanstack/react-router'

import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '~/components/ui'

import { Logo, SignInForm } from '~/components'

export const Route = createFileRoute('/sign-in')({
	component: SignIn,
})

function SignIn() {
	return (
		<div className='bg-background min-h-screen'>
			<a
				href='https://lifenomics.app'
				className='absolute left-6 top-6 z-10 transition-all duration-200 hover:scale-105'
			>
				<Button variant='ghost'>
					<ChevronLeftIcon className='mr-2 size-4' />
					Back
				</Button>
			</a>
			<div className='relative flex min-h-screen items-center justify-center px-4 py-12'>
				<div className='w-full max-w-md'>
					<div className='mb-10 flex flex-col items-center justify-center'>
						<Logo
							width={140}
							height={50}
							className='text-primary'
						/>
						<p>Sign in to your account to continue</p>
					</div>

					<div className='border-border rounded-2xl border bg-white/30 p-8 shadow-xl backdrop-blur-sm'>
						<SignInForm />
						<div className='my-6 flex items-center'>
							<div className='border-border flex-1 border-t'></div>
							<span className='px-4 text-sm'>or</span>
							<div className='border-border flex-1 border-t'></div>
						</div>
						<p className='text-center text-sm'>
							Don&apos;t have an account?{' '}
							<Link
								to='/sign-up'
								className='text-accent font-semibold hover:underline'
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
