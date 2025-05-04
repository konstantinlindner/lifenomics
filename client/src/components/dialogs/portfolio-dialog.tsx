import { useEffect, useState } from 'react'

import { invalidateQuery } from '@/clients'
import {
	createPortfolio,
	deletePortfolio,
	getPortfolioById,
	updatePortfolio,
} from '@/fetch'
import { log } from '@/helpers'

import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogDescription } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { PenIcon, PlusIcon } from 'lucide-react'

import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
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

type PortfolioDialogProps = {
	portfolioId?: number // if a portfolioId is passed in, the component will be in edit mode
	showButtonText?: boolean
}

export function PortfolioDialog({
	portfolioId,
	showButtonText = false,
}: PortfolioDialogProps) {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data: portfolio } = useQuery({
		queryKey: ['getPortfolioById', portfolioId ?? 0],
		queryFn: () => getPortfolioById(portfolioId ?? 0),
	})

	const portfolioInputSchema = z.object({
		name: z
			.string()
			.trim()
			.min(2, { message: 'The name must be at least 2 characters long' }),
		comment: z.string().trim().optional(),
	})

	type PortfolioInput = z.infer<typeof portfolioInputSchema>

	const form = useForm<PortfolioInput>({
		resolver: zodResolver(portfolioInputSchema),
		defaultValues: {
			name: portfolio?.name ?? '',
			comment: portfolio?.comment ?? '',
		},
	})

	useEffect(() => {
		if (portfolio) {
			form.reset({
				name: portfolio.name,
				comment: portfolio.comment ?? '',
			})
		}
	}, [portfolio, form])

	async function handleSubmit(values: PortfolioInput) {
		setIsLoading(true)

		const portfolio =
			portfolioId ?
				await updatePortfolio({
					id: portfolioId,
					...values,
				})
			:	await createPortfolio({
					...values,
				})

		if (!portfolio) {
			toast(
				portfolioId ?
					'Could not update portfolio, try again'
				:	'Could not create portfolio, try again',
			)

			setIsLoading(false)
			return
		}

		await invalidateQuery(['getPortfolios'])

		setIsLoading(false)
		setOpen(false)
	}

	async function handleDelete(id: number) {
		try {
			await deletePortfolio(id)

			await invalidateQuery(['getPortfolios'])
		} catch (error) {
			log(error)
			toast('Something went wrong, please try again')
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{portfolioId ?
					<Button variant='ghost' size='icon'>
						<PenIcon className='size-4' />
					</Button>
				: showButtonText ?
					<Button variant='secondary'>
						<PlusIcon />
						Create portfolio
					</Button>
				:	<Button variant='secondary' className='w-fit'>
						<PlusIcon />
					</Button>
				}
			</DialogTrigger>

			<DialogContent className='p-8 sm:max-w-[425px]'>
				<AlertDialogHeader>
					<DialogTitle>
						{portfolioId ?
							'Edit portfolio'
						:	'Create new portfolio'}
					</DialogTitle>
					<DialogDescription>
						You can then link assets to the portfolio
					</DialogDescription>
				</AlertDialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-2'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											id='name'
											type='text'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='comment'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Comment</FormLabel>
									<FormControl>
										<Input
											id='comment'
											type='text'
											autoCapitalize='none'
											autoCorrect='off'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							disabled={isLoading}
							type='submit'
							className='mt-4 w-full'
							variant={'secondary'}
						>
							{isLoading ?
								<LoadingIndicator size='sm' />
							:	'Save'}
						</Button>
						{portfolioId && (
							<Button
								onClick={() => handleDelete(portfolioId)}
								className='mt-4 w-full'
								variant={'destructive'}
							>
								Delete portfolio
							</Button>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
