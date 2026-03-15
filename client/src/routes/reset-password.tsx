import { useState } from 'react'

import { password } from '@lifenomics/shared/schemas'

import { log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { authClient } from '~/lib/auth-client'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import {
	Button,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator, Logo } from '~/components'

const resetPasswordSchema = z
	.object({
		newPassword: password,
		confirmPassword: password,
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: "Passwords don't match",
		path: ['confirmPassword'],
	})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export const Route = createFileRoute('/reset-password')({
	validateSearch: (search: Record<string, unknown>) => {
		const token =
			typeof search.token === 'string' ? search.token : undefined
		const error =
			typeof search.error === 'string' ? search.error : undefined
		return { token, error }
	},
	component: ResetPasswordPage,
})

function ResetPasswordPage() {
	const navigate = useNavigate()
	const { token, error: urlError } = Route.useSearch()
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { newPassword: '', confirmPassword: '' },
	})

	async function handleSubmit(values: ResetPasswordForm) {
		if (!token) {
			toast.error('Invalid or missing reset link. Request a new one.')
			return
		}

		try {
			setIsLoading(true)
			const { error } = await authClient.resetPassword({
				newPassword: values.newPassword,
				token,
			})

			if (error) {
				toast.error(error.message ?? 'Failed to reset password')
				return
			}

			toast.success('Password reset. You can now sign in.')
			await navigate({ to: '/sign-in' })
		} catch (err) {
			log(err)
			toast.error('Something went wrong, please try again')
		} finally {
			setIsLoading(false)
		}
	}

	const invalidToken = urlError === 'INVALID_TOKEN' || !token

	return (
		<div className='relative flex min-h-screen items-center justify-center px-4 py-12'>
			<div className='w-full max-w-md'>
				<div className='mb-10 flex flex-col items-center justify-center'>
					<Logo width={140} height={50} className='text-primary' />
					<p className='mt-2 text-center'>
						{invalidToken ?
							'Invalid or expired reset link'
						:	'Choose a new password'}
					</p>
				</div>

				<div className='rounded-2xl border border-border bg-white/30 p-8 shadow-xl backdrop-blur-sm'>
					{invalidToken ?
						<div className='space-y-4'>
							<p className='text-center text-sm text-muted-foreground'>
								This link is invalid or has expired. Request a
								new password reset link.
							</p>
							<Button asChild className='w-full'>
								<Link to='/forgot-password'>
									Request new link
								</Link>
							</Button>
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
									name='newPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm font-medium'>
												New password
											</FormLabel>
											<FormControl>
												<div className='relative'>
													<Input
														id='newPassword'
														type={
															showPassword ?
																'text'
															:	'password'
														}
														autoComplete='new-password'
														placeholder='At least 8 characters'
														{...field}
													/>
													<button
														type='button'
														onClick={() => {
															setShowPassword(
																!showPassword,
															)
														}}
														className='absolute top-1/2 right-3 -translate-y-1/2 text-secondary transition-colors duration-200 hover:text-primary'
													>
														{showPassword ?
															<EyeOffIcon className='size-4' />
														:	<EyeIcon className='size-4' />
														}
													</button>
												</div>
											</FormControl>
											<FormMessage className='text-sm' />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='confirmPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm font-medium'>
												Confirm password
											</FormLabel>
											<FormControl>
												<Input
													id='confirmPassword'
													type='password'
													autoComplete='new-password'
													placeholder='Confirm new password'
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
											Resetting...
										</div>
									:	'Reset password'}
								</Button>
							</form>
						</FormProvider>
					}

					<p className='mt-6 text-center text-sm text-muted-foreground'>
						<Link
							to='/sign-in'
							className='font-semibold text-accent hover:underline'
						>
							Back to sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
