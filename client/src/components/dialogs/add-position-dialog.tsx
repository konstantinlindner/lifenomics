import { useEffect } from 'react'

import { type PositionCreate, positionCreate } from '@lifenomics/shared/schemas'

import { trpc } from '~/clients'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	FormControl,
	FormLabel,
	FormMessage,
	Input,
} from '~/components/ui'
import { Button } from '~/components/ui/button'

type AddPositionDialogProps = {
	symbol: string
	currency?: string
	open: boolean
	onOpenChange: (open: boolean) => void
	existingPosition?: {
		id: number
		quantity: number
		averagePurchasePrice: number
		currency: string
	} | null
	onSuccess?: () => void
}

export function AddPositionDialog({
	symbol,
	currency: defaultCurrency = 'USD',
	open,
	onOpenChange,
	existingPosition,
	onSuccess,
}: AddPositionDialogProps) {
	const queryClient = useQueryClient()

	const form = useForm<PositionCreate>({
		resolver: zodResolver(positionCreate),
		defaultValues: {
			symbol,
			quantity: 1,
			averagePurchasePrice: 0,
			currency: defaultCurrency,
		},
	})

	useEffect(() => {
		if (open) {
			form.reset({
				symbol,
				quantity: existingPosition?.quantity ?? 1,
				averagePurchasePrice:
					existingPosition?.averagePurchasePrice ?? 0,
				currency: existingPosition?.currency ?? defaultCurrency,
			})
		}
	}, [
		open,
		symbol,
		defaultCurrency,
		existingPosition?.quantity,
		existingPosition?.averagePurchasePrice,
		existingPosition?.currency,
		form,
	])

	const addPosition = useMutation(
		trpc.portfolio.addPosition.mutationOptions(),
	)
	const updatePosition = useMutation(
		trpc.portfolio.updatePosition.mutationOptions(),
	)

	const isEdit = existingPosition != null

	function onSubmit(values: PositionCreate) {
		if (isEdit) {
			updatePosition.mutate(
				{
					id: existingPosition.id,
					quantity: values.quantity,
					averagePurchasePrice: values.averagePurchasePrice,
					currency: values.currency,
				},
				{
					onSuccess: () => {
						void queryClient.invalidateQueries({
							queryKey: trpc.portfolio.getPositions.queryKey(),
						})
						void queryClient.invalidateQueries({
							queryKey:
								trpc.portfolio.getPositionBySymbol.queryKey({
									symbol: values.symbol,
								}),
						})
						toast.success('Position updated.')
						onOpenChange(false)
						onSuccess?.()
					},
					onError: (err) => {
						toast.error(err.message)
					},
				},
			)
		} else {
			addPosition.mutate(values, {
				onSuccess: () => {
					void queryClient.invalidateQueries({
						queryKey: trpc.portfolio.getPositions.queryKey(),
					})
					void queryClient.invalidateQueries({
						queryKey: trpc.portfolio.getPositionBySymbol.queryKey({
							symbol: values.symbol,
						}),
					})
					toast.success('Added to portfolio.')
					onOpenChange(false)
					onSuccess?.()
				},
				onError: (err) => {
					toast.error(err.message)
				},
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEdit ? 'Edit position' : 'Add to portfolio'}
					</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='symbol'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Symbol</FormLabel>
									<FormControl>
										<Input
											{...field}
											readOnly
											disabled
											className='bg-muted'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='quantity'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quantity</FormLabel>
									<FormControl>
										<Input
											type='number'
											step='any'
											min={0.000001}
											{...field}
											onChange={(e) => {
												field.onChange(
													e.target.valueAsNumber || 0,
												)
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='averagePurchasePrice'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Average purchase price
									</FormLabel>
									<FormControl>
										<Input
											type='number'
											step='any'
											min={0}
											{...field}
											onChange={(e) => {
												field.onChange(
													e.target.valueAsNumber || 0,
												)
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Currency</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => {
									onOpenChange(false)
								}}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								disabled={
									addPosition.isPending
									|| updatePosition.isPending
								}
							>
								{isEdit ? 'Update' : 'Add'}
							</Button>
						</div>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}
