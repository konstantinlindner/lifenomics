import { Link, createFileRoute } from '@tanstack/react-router'

import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '~/components/ui'

import { Logo, SignUpForm } from '~/components'

export const Route = createFileRoute('/sign-up')({
	component: SignUp,
})

function SignUp() {
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
				<div className='w-full max-w-xl'>
					<div className='mb-10 flex flex-col items-center justify-center'>
						<Logo
							width={140}
							height={50}
							className='text-primary'
						/>
						<p>Create your account to get started</p>
					</div>

					<div className='border-border rounded-2xl border bg-white/30 p-8 shadow-xl backdrop-blur-sm'>
						<SignUpForm />
						<div className='my-6 flex items-center'>
							<div className='border-border flex-1 border-t'></div>
							<span className='px-4 text-sm'>or</span>
							<div className='border-border flex-1 border-t'></div>
						</div>
						<p className='text-center text-sm'>
							Already have an account?{' '}
							<Link
								to='/sign-in'
								className='text-accent font-semibold hover:underline'
							>
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
