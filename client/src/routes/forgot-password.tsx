import { useState } from 'react'

import { email } from '@lifenomics/shared/schemas'

import { log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { authClient } from '~/lib/auth-client'

import {
	Button,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator, Logo } from '~/components'

const forgotPasswordSchema = z.object({
	email: email,
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const Route = createFileRoute('/forgot-password')({
	component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const form = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' },
	})

	async function handleSubmit(values: ForgotPasswordForm) {
		try {
			setIsLoading(true)
			const redirectTo = `${window.location.origin}/reset-password`
			const { error } = await authClient.requestPasswordReset({
				email: values.email,
				redirectTo,
			})

			if (error) {
				toast.error(error.message ?? 'Failed to send reset email')
				return
			}

			setSubmitted(true)
			toast.success(
				'If that email is in our system, we sent a link to reset your password.',
			)
		} catch (err) {
			log(err)
			toast.error('Something went wrong, please try again')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='relative flex min-h-screen items-center justify-center px-4 py-12'>
			<div className='w-full max-w-md'>
				<div className='mb-10 flex flex-col items-center justify-center'>
					<Logo width={140} height={50} className='text-primary' />
					<p className='mt-2 text-center'>
						{submitted ?
							'Check your email'
						:	'Enter your email to reset your password'}
					</p>
				</div>

				<div className='rounded-2xl border border-border bg-white/30 p-8 shadow-xl backdrop-blur-sm'>
					{submitted ?
						<div className='space-y-4'>
							<p className='text-center text-sm text-muted-foreground'>
								If an account exists for that email, we sent a
								link to reset your password. Check your inbox
								and spam folder.
							</p>
							<Button
								asChild
								className='w-full'
								variant='outline'
							>
								<Link to='/sign-in'>Back to sign in</Link>
							</Button>
						</div>
					:	<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(handleSubmit)}
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
												<Input
													id='email'
													type='email'
													autoComplete='email'
													placeholder='Enter your email'
													{...field}
												/>
											</FormControl>
											<FormMessage className='text-sm' />
										</FormItem>
									)}
								/>
								<Button
									disabled={isLoading}
									className='w-full'
									type='submit'
								>
									{isLoading ?
										<div className='flex items-center justify-center'>
											<LoadingIndicator
												size='sm'
												className='mr-2'
											/>
											Sending...
										</div>
									:	'Send reset link'}
								</Button>
							</form>
						</FormProvider>
					}

					{!submitted && (
						<p className='mt-6 text-center text-sm text-muted-foreground'>
							<Link
								to='/sign-in'
								className='font-semibold text-accent hover:underline'
							>
								Back to sign in
							</Link>
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
