import { useState } from 'react'

import { type UserSignUp, userSignUp } from '@lifenomics/shared/schemas'

import { isTRPCClientError, trpc } from '~/clients'
import { log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	Button,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator } from '~/components'

export function SignUpForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const signUp = useMutation(trpc.user.signUp.mutationOptions())

	const form = useForm<UserSignUp>({
		resolver: zodResolver(userSignUp),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		},
	})

	async function handleSignUp(values: UserSignUp) {
		try {
			setIsLoading(true)
			await signUp.mutateAsync(values)
			await router.invalidate()
			window.location.href = '/'
		} catch (error) {
			log(error)

			if (isTRPCClientError(error)) {
				toast.error(error.message)
				return
			}

			toast.error('Something went wrong, please try again')
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(handleSignUp)}
				className='space-y-2'
			>
				<FormField
					control={form.control}
					name='firstName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>First name</FormLabel>
							<FormControl>
								<Input
									id='firstName'
									type='text'
									autoCapitalize='words'
									autoComplete='given-name'
									autoCorrect='on'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='lastName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last name</FormLabel>
							<FormControl>
								<Input
									id='lastName'
									type='text'
									autoCapitalize='words'
									autoComplete='family-name'
									autoCorrect='on'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									id='email'
									type='email'
									autoCapitalize='none'
									autoComplete='email'
									autoCorrect='off'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									id='password'
									type='password'
									autoComplete='new-password'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='pt-6'>
					<Button
						disabled={isLoading}
						className='w-full'
						type='submit'
					>
						{isLoading ?
							<LoadingIndicator size='sm' />
						:	'Create account'}
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}
