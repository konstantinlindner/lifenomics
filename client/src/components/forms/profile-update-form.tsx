import { useState } from 'react'

import { isTRPCClientError, trpc } from '~/clients'
import { invalidateQuery, log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator } from '~/components'

const formSchema = z
	.object({
		email: z
			.string({
				required_error: 'Email is required',
			})
			.trim()
			.email('Please enter a valid email address'),
		currentPassword: z
			.string()
			.min(8, {
				message: 'Password should be at least 8 characters long',
			})
			.optional(),
		newPassword: z
			.string()
			.min(8, {
				message: 'Password should be at least 8 characters long',
			})
			.optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.newPassword && data.newPassword !== data.confirmPassword) {
				return false
			}
			return true
		},
		{
			message: "Passwords don't match",
			path: ['confirmPassword'],
		},
	)
	.refine(
		(data) => {
			// If updating password, current password is required
			if (data.newPassword && !data.currentPassword) {
				return false
			}
			return true
		},
		{
			message: 'Current password is required when changing password',
			path: ['currentPassword'],
		},
	)

type FormValues = z.infer<typeof formSchema>

interface ProfileUpdateFormProps {
	currentEmail: string
}

export function ProfileUpdateForm({ currentEmail }: ProfileUpdateFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const updateUser = useMutation(trpc.user.update.mutationOptions())

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: currentEmail,
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	})

	async function handleUpdate(values: FormValues) {
		try {
			setIsLoading(true)

			const hasEmailChange = values.email !== currentEmail
			const hasPasswordChange = !!values.newPassword

			if (hasEmailChange) {
				await updateUser.mutateAsync({ email: values.email })
			}

			if (hasPasswordChange && values.currentPassword) {
				await updateUser.mutateAsync({ password: values.newPassword })
			}

			if (hasEmailChange || hasPasswordChange) {
				await invalidateQuery(trpc.user.get.queryKey())

				toast.success('Profile updated successfully')

				form.setValue('currentPassword', '')
				form.setValue('newPassword', '')
				form.setValue('confirmPassword', '')
			} else {
				toast.info('No changes to save')
			}
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
		<Card className='h-full'>
			<CardHeader>
				<CardTitle>Profile Settings</CardTitle>
				<CardDescription>
					Update your email address and password
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(handleUpdate)}
						className='space-y-6'
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

						<div className='space-y-4'>
							<h3 className='font-semibold'>Change Password</h3>
							<FormField
								control={form.control}
								name='currentPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Current Password (required when
											changing password)
										</FormLabel>
										<FormControl>
											<Input
												id='currentPassword'
												type='password'
												autoComplete='current-password'
												placeholder='Enter current password to change password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												id='newPassword'
												type='password'
												autoComplete='new-password'
												placeholder='Leave blank to keep current password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Confirm New Password
										</FormLabel>
										<FormControl>
											<Input
												id='confirmPassword'
												type='password'
												autoComplete='new-password'
												placeholder='Confirm your new password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='pt-6'>
							<Button
								disabled={isLoading}
								className='w-full'
								type='submit'
							>
								{isLoading ?
									<LoadingIndicator size='sm' />
								:	'Update Profile'}
							</Button>
						</div>
					</form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
