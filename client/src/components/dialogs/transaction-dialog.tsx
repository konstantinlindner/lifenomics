import { useEffect, useState } from 'react'

import {
	type TransactionCreate,
	transactionCreate,
} from '@lifenomics/shared/schemas'

import { trpc } from '~/clients'
import { invalidateQuery, log } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { PenIcon, PlusIcon, PlusSquareIcon } from 'lucide-react'

import {
	AlertDialogHeader,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	DropdownMenuItem,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SidebarMenuButton,
	SidebarMenuItem,
} from '~/components/ui'
import { Button } from '~/components/ui/button'

import { LoadingIndicator } from '~/components'

type TransactionDialogProps = {
	transactionId?: number // if an transactionId is passed in, the component will be in edit mode
	type?: 'button' | 'button-with-text' | 'sidebar' | 'dropdown'
}

export function TransactionDialog({
	transactionId,
	type = 'sidebar',
}: TransactionDialogProps) {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data: transaction } = useQuery(
		trpc.transaction.getById.queryOptions(transactionId as number, {
			enabled: !!transactionId,
		}),
	)
	const { data: assets } = useQuery(trpc.asset.get.queryOptions())

	const createTransaction = useMutation(
		trpc.transaction.create.mutationOptions(),
	)
	const updateTransaction = useMutation(
		trpc.transaction.update.mutationOptions(),
	)

	const form = useForm<TransactionCreate>({
		resolver: zodResolver(transactionCreate),
	})

	useEffect(() => {
		if (transaction) {
			form.reset({
				assetId: transaction.assetId,
				transactionType: transaction.transactionType,
				quantity: Number(transaction.quantity),
				price: Number(transaction.price),
				timestamp: dayjs(transaction.timestamp).toDate(),
			})
		}
	}, [transaction, form])

	async function onSubmit(values: TransactionCreate) {
		setIsLoading(true)

		try {
			if (transactionId) {
				await updateTransaction.mutateAsync({
					...values,
					id: transactionId,
				})
			} else {
				await createTransaction.mutateAsync({
					...values,
				})
			}

			toast(
				transactionId ?
					'Transaction updated successfully'
				:	'Transaction created successfully',
			)

			await invalidateQuery(trpc.transaction.get.queryKey())
			setOpen(false)
		} catch (error) {
			log(error)
			toast(
				transactionId ?
					'Could not update transaction, please try again'
				:	'Could not create transaction, please try again',
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{transactionId ?
					<Button variant='ghost' size='icon'>
						<PenIcon className='size-4' />
					</Button>
				: type === 'button-with-text' ?
					<Button variant='secondary'>
						<PlusIcon />
						Create transaction
					</Button>
				: type === 'sidebar' ?
					<SidebarMenuItem>
						<SidebarMenuButton>
							<PlusSquareIcon className='size-4' />
							<span className='ml-2'>Add transaction</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				: type === 'dropdown' ?
					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault()
							setOpen(true)
						}}
					>
						Transaction
					</DropdownMenuItem>
				:	<Button variant='outline' size='icon'>
						<PlusIcon />
					</Button>
				}
			</DialogTrigger>

			<DialogContent className='p-8 sm:max-w-[425px]'>
				<AlertDialogHeader>
					<DialogTitle className='text-2xl font-bold'>
						{transactionId ? 'Edit transaction' : 'Add transaction'}
					</DialogTitle>
				</AlertDialogHeader>
				<FormProvider {...form}>
					<form
						className='space-y-2'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='assetId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Asset</FormLabel>
									<FormControl>
										<Input {...field} placeholder='ID' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='transactionType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Asset</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={
											transaction?.transactionType
										}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Choose an asset' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{assets && assets.length > 0 ?
												assets.map((asset) => (
													<SelectItem
														key={asset.id}
														value={asset.id.toString()}
													>
														{asset.ticker}
													</SelectItem>
												))
											:	<SelectItem value='loading'>
													Loading...
												</SelectItem>
											}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							disabled={isLoading}
							type='submit'
							className='w-full'
						>
							{isLoading ?
								<LoadingIndicator size='sm' />
							:	'Save'}
						</Button>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}
