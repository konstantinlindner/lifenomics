import { useState } from 'react'

import { signUp } from '@/fetch'

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
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	async function handleSignUp(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		const signUpResponse = await signUp(values)

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
							variant={'secondary'}
							type='submit'
						>
							{isLoading ?
								<LoadingIndicator size='sm' />
							:	'Create account'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
