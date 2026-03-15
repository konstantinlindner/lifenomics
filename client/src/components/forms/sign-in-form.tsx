import { useState } from 'react'

import { type UserSignIn, userSignIn } from '@lifenomics/shared/schemas'

import { log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authClient } from '~/lib/auth-client'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import {
	Button,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator } from '~/components'

export function SignInForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm<UserSignIn>({
		resolver: zodResolver(userSignIn),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function handleSignIn(values: UserSignIn) {
		try {
			setIsLoading(true)
			const { error } = await authClient.signIn.email({
				email: values.email,
				password: values.password,
				callbackURL: '/',
			})

			if (error) {
				toast.error(error.message ?? 'Sign in failed')
				return
			}

			await router.invalidate()
			window.location.href = '/'
		} catch (error) {
			log(error)
			toast.error('Something went wrong, please try again')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(handleSignIn)}
				className='space-y-6'
			>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-sm font-medium'>
								Email address
							</FormLabel>
							<FormControl>
								<div className='relative'>
									<Input
										id='email'
										type='email'
										autoCapitalize='none'
										autoComplete='email'
										autoCorrect='off'
										className='transition-all duration-200'
										placeholder='Enter your email'
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage className='text-sm' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-sm font-medium'>
								Password
							</FormLabel>
							<FormControl>
								<div className='relative'>
									<Input
										id='password'
										type={
											showPassword ? 'text' : 'password'
										}
										autoComplete='current-password'
										placeholder='Enter your password'
										{...field}
									/>
									<button
										type='button'
										onClick={() => {
											setShowPassword(!showPassword)
										}}
										className='absolute top-1/2 right-3 -translate-y-1/2 text-secondary transition-colors duration-200 hover:text-primary'
									>
										{showPassword ?
											<EyeOffIcon className='size-4' />
										:	<EyeIcon className='size-4' />}
									</button>
								</div>
							</FormControl>
							<FormMessage className='text-sm' />
						</FormItem>
					)}
				/>

				<div className='text-right'>
					<Link
						to='/forgot-password'
						className='text-sm text-secondary transition-colors duration-200 hover:text-primary'
					>
						Forgot your password?
					</Link>
				</div>

				<Button disabled={isLoading} className='w-full' type='submit'>
					{isLoading ?
						<div className='flex items-center justify-center'>
							<LoadingIndicator size='sm' className='mr-2' />
							Signing in...
						</div>
					:	'Sign in to your account'}
				</Button>
			</form>
		</FormProvider>
	)
}
