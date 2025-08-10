import { useState } from 'react'

import { type UserUpdate, userUpdate } from '@lifenomics/shared/schemas'

import { isTRPCClientError, trpc } from '~/clients'
import { cn, invalidateQuery, log } from '~/helpers'
import { useUser } from '~/hooks'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CalendarIcon } from 'lucide-react'

import {
	Button,
	Calendar,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	FormControl,
	FormDescription,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui'

import { LoadingIndicator, ProfilePicturePicker } from '~/components'

export function ProfileUpdateForm() {
	const [isLoading, setIsLoading] = useState(false)

	const { user } = useUser()
	const updateUser = useMutation(trpc.user.update.mutationOptions())

	const form = useForm<UserUpdate>({
		resolver: zodResolver(userUpdate),
		defaultValues: {
			firstName: user?.firstName ?? '',
			lastName: user?.lastName ?? '',
			birthDate:
				user?.birthDate ? dayjs(user.birthDate).toDate() : undefined,
			email: user?.email ?? '',
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	})

	async function handleUpdate(values: UserUpdate) {
		try {
			setIsLoading(true)

			await updateUser.mutateAsync({
				firstName: values.firstName,
				lastName: values.lastName,
				birthDate: values.birthDate,
				email: values.email,
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			})

			await invalidateQuery(trpc.user.get.queryKey())

			form.reset({
				firstName: values.firstName,
				lastName: values.lastName,
				birthDate: values.birthDate,
				email: values.email,
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			})

			toast.success('Profile updated successfully')
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
					Update your profile information
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-center'>
					<ProfilePicturePicker />
				</div>

				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(handleUpdate)}
						className='space-y-6 pt-8'
					>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												id='firstName'
												type='text'
												autoCapitalize='none'
												autoComplete='given-name'
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
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input
												id='lastName'
												type='text'
												autoCapitalize='none'
												autoComplete='last-name'
												autoCorrect='off'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='birthDate'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Date of birth</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant='outline'
													className={cn(
														'w-[200px] pl-3 text-left font-normal',
														!field.value &&
															'text-muted-foreground',
													)}
												>
													{field.value ?
														dayjs(
															field.value,
														).format('DD/MM/YYYY')
													:	<span>Pick a date</span>}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className='z-[9999]'
											align='start'
											sideOffset={8}
										>
											<Calendar
												mode='single'
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date > new Date() ||
													date <
														new Date('1900-01-01')
												}
												captionLayout='dropdown'
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>
										Your date of birth is used to calculate
										your age.
									</FormDescription>
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
