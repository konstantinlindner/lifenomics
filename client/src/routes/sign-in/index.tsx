import { Link } from 'react-router-dom'

import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Logo } from '@/components'

import { SignInForm } from './sign-in-form'

export function SignIn() {
	return (
		<div className='container flex flex-col items-center justify-center'>
			<a
				href='https://life.konstantin.app'
				className='absolute left-4 top-4 md:left-8 md:top-8'
			>
				<Button variant='ghost'>
					<ChevronLeftIcon className='mr-2 size-5' />
					Home
				</Button>
			</a>
			<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
				<div className='flex flex-col space-y-2 text-center'>
					<div className='mx-auto size-6 pb-8'>
						<Logo hideText />
					</div>
					<h1 className='text-2xl font-semibold tracking-tight'>
						Welcome back
					</h1>
					<p className='text-muted-foreground text-sm'>
						Enter your details to continue
					</p>
				</div>
				<SignInForm />
				<p className='text-muted-foreground px-8 text-center text-sm'>
					<Link
						to='/sign-up'
						className='hover:text-brand underline underline-offset-4'
					>
						No account? Sign up
					</Link>
				</p>
			</div>
		</div>
	)
}
