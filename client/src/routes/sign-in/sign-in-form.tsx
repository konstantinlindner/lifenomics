import { useState } from 'react'

import { signIn } from '@/fetch'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { LoadingIndicator } from '@/components'

export function SignInForm() {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false)

	const formSchema = z.object({
		email: z.string().trim().email(),
		password: z.string(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	async function handleSignIn(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		const signUpResponse = await signIn(values)

		if (signUpResponse !== 'SUCCESS') {
			toast('Something went wrong')
			setIsLoading(false)
			return
		}

		navigate('/')
		navigate(0)
		setIsLoading(false)
	}

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSignIn)}
					className='space-y-2'
				>
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
										autoComplete='current-password'
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
							variant={'secondary'}
						>
							{isLoading ?
								<LoadingIndicator size='sm' />
							:	'Sign in'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
