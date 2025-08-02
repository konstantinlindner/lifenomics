import { useState } from 'react'

import { isTRPCClientError, trpc } from '~/clients'
import { log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	Button,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator } from '~/components'

const formSchema = z.object({
	firstName: z
		.string({
			required_error: 'First name is required',
		})
		.trim()
		.min(2, {
			message: 'First name should be at least 2 characters long',
		}),
	lastName: z
		.string({
			required_error: 'Last name is required',
		})
		.trim()
		.min(2, {
			message: 'Last name should be at least 2 characters long',
		}),
	email: z
		.string({
			required_error: 'Email is required',
		})
		.trim()
		.email(),
	password: z
		.string({
			required_error: 'Password is required',
		})
		.min(8, {
			message: 'Password should be at least 8 characters long',
		}),
})

export function SignUpForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const signUp = useMutation(trpc.user.signUp.mutationOptions())

	async function handleSignUp(values: z.infer<typeof formSchema>) {
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
							<FormLabel>Förnamn</FormLabel>
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
							<FormLabel>Efternamn</FormLabel>
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
						:	'Skapa konto'}
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}
