import { useEffect, useState } from 'react'

import {
	type PortfolioCreate,
	portfolioCreate,
} from '@lifenomics/shared/schemas'

import { trpc } from '~/clients'
import { invalidateQuery, log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TRPCClientError } from '@trpc/client'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { PenIcon, PlusIcon } from 'lucide-react'

import {
	AlertDialogHeader,
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
	DropdownMenuItem,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'

import { LoadingIndicator } from '~/components'

type PortfolioDialogProps = {
	portfolioId?: number // if a portfolioId is passed in, the component will be in edit mode
	type?: 'button' | 'button-with-text' | 'sidebar' | 'dropdown'
}

export function PortfolioDialog({
	portfolioId,
	type = 'button',
}: PortfolioDialogProps) {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data: portfolio } = useQuery(
		trpc.portfolio.getById.queryOptions(portfolioId as number, {
			enabled: !!portfolioId,
		}),
	)

	const createPortfolio = useMutation(trpc.portfolio.create.mutationOptions())
	const updatePortfolio = useMutation(trpc.portfolio.update.mutationOptions())
	const deletePortfolio = useMutation(trpc.portfolio.delete.mutationOptions())

	const form = useForm<PortfolioCreate>({
		resolver: zodResolver(portfolioCreate),
		defaultValues: {
			name: portfolio?.name,
			comment: portfolio?.comment ?? undefined,
		},
	})

	useEffect(() => {
		if (portfolio) {
			form.reset({
				name: portfolio.name,
				comment: portfolio.comment ?? undefined,
			})
		}
	}, [portfolio, form])

	async function handleSubmit(values: PortfolioCreate) {
		setIsLoading(true)

		try {
			if (portfolioId) {
				await updatePortfolio.mutateAsync({
					id: portfolioId,
					...values,
				})
			} else {
				await createPortfolio.mutateAsync({
					...values,
				})
			}

			await invalidateQuery(trpc.portfolio.get.queryKey())
			setOpen(false)
		} catch (error) {
			if (error instanceof TRPCClientError) {
				toast(error.message)
			} else {
				log(error)
				if (portfolioId) {
					toast('Could not update portfolio')
				} else {
					toast('Could not create portfolio')
				}
			}
		} finally {
			setIsLoading(false)
		}
	}

	async function handleDelete(id: number) {
		try {
			await deletePortfolio.mutateAsync(id)
			await invalidateQuery(trpc.portfolio.get.queryKey())
			setOpen(false)
		} catch (error) {
			if (error instanceof TRPCClientError) {
				toast(error.message)
			} else {
				log(error)
				toast('Could not delete portfolio')
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{portfolioId ?
					<Button variant='ghost' size='icon'>
						<PenIcon className='size-4' />
					</Button>
				: type === 'button-with-text' ?
					<Button variant='secondary'>
						<PlusIcon />
						Create portfolio
					</Button>
				: type === 'dropdown' ?
					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault()
							setOpen(true)
						}}
					>
						Portfolio
					</DropdownMenuItem>
				:	<Button variant='outline' size='icon'>
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
				<FormProvider {...form}>
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
						>
							{isLoading ?
								<LoadingIndicator size='sm' />
							:	'Save'}
						</Button>
						{portfolioId && (
							<Button
								onClick={() => handleDelete(portfolioId)}
								className='mt-4 w-full'
								variant='destructive'
							>
								Delete portfolio
							</Button>
						)}
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}
