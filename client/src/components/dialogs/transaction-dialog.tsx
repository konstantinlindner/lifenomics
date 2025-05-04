import { useEffect, useState } from 'react'

import { invalidateQuery } from '@/clients'
import {
	createTransaction,
	getAssets,
	getTransactionById,
	updateTransaction,
} from '@/fetch'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { PenIcon, PlusIcon, PlusSquareIcon } from 'lucide-react'

import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	Dialog,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

import { LoadingIndicator } from '@/components'

type TransactionDialogProps = {
	transactionId?: number // if an transactionId is passed in, the component will be in edit mode
	type?: 'button' | 'button-with-text' | 'sidebar'
}

export function TransactionDialog({
	transactionId,
	type = 'sidebar',
}: TransactionDialogProps) {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data: transaction } = useQuery({
		queryKey: ['getTransactionById', transactionId],
		queryFn: () => getTransactionById(transactionId as number),
		enabled: !!transactionId,
	})

	const { data: assets } = useQuery({
		queryKey: ['getAssets'],
		queryFn: () => getAssets(),
	})

	const formSchema = z.object({
		assetId: z.number(),
		transactionType: z.enum(['purchase', 'sale']),
		quantity: z.number(),
		price: z.string(),
		date: z.string(),
	})

	type Form = z.infer<typeof formSchema>

	const form = useForm<Form>({
		resolver: zodResolver(formSchema),
	})

	useEffect(() => {
		if (transaction) {
			form.reset({
				assetId: transaction.assetId,
				transactionType: transaction.transactionType,
				quantity: transaction.quantity,
				price: transaction.price,
				date: transaction.date,
			})
		}
	}, [transaction, form])

	async function onSubmit(values: Form) {
		setIsLoading(true)

		const transaction =
			transactionId ?
				await updateTransaction({
					...values,
					id: transactionId,
					price: parseFloat(values.price),
				})
			:	await createTransaction({
					...values,
					price: parseFloat(values.price),
				})

		if (!transaction) {
			toast(
				transactionId ?
					'Could not update transaction, please try again'
				:	'Could not create transaction, please try again',
			)

			setIsLoading(false)
			return
		}

		await invalidateQuery(['getTransactions'])
		await invalidateQuery(['getTransactionById', transactionId])
		await invalidateQuery(['getAssets'])

		setIsLoading(false)
		setOpen(false)
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
				:	<Button variant='secondary'>
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
				<Form {...form}>
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
											:	<SelectItem value=''>
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
							variant={'secondary'}
						>
							{isLoading ?
								<LoadingIndicator size='sm' />
							:	'Save'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
