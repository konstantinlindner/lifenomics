import { useEffect, useState } from 'react'

import { useUser } from '@/contexts'
import { updateUser } from '@/fetch'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { LoadingIndicator, ProfilePicturePicker } from '@/components'

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
		.toLowerCase()
		.email({ message: 'Invalid email' }),
	birthdate: z.date().optional(),
})

export function Profile() {
	const { user } = useUser()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
		},
		resolver: zodResolver(formSchema),
	})

	useEffect(() => {
		if (user) {
			form.reset({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			})
		}
	}, [user, form])

	async function handleSave(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		await updateUser(values)

		toast('Saved successfully')

		setIsLoading(false)
	}

	return (
		<main>
			<Card className='bg-background my-20 flex max-w-sm flex-col gap-4 border-none lg:p-6'>
				<div className='mx-auto'>
					<ProfilePicturePicker />
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSave)}
						className='space-y-2'
					>
						<div className='flex gap-2'>
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
						</div>

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
						<div className='pt-6'>
							<Button type='submit'>
								{isLoading ?
									<LoadingIndicator size='sm' />
								:	'Save'}
							</Button>
						</div>
					</form>
				</Form>
			</Card>
		</main>
	)
}
