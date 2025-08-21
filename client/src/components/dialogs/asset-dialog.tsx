import { useEffect, useState } from 'react'

import { type AssetCreate, assetCreate } from '@lifenomics/shared/schemas'

import { trpc } from '~/clients'
import { invalidateQuery } from '~/helpers'
import { FormField, FormItem } from '~/providers'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { PenIcon, PlusIcon, PlusSquareIcon } from 'lucide-react'

import {
	AlertDialogHeader,
	Button,
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

import { LoadingIndicator } from '~/components'

type AssetDialogProps = {
	assetId?: number // if an assetId is passed in, the component will be in edit mode
	type?: 'button' | 'button-with-text' | 'sidebar' | 'dropdown'
}

export function AssetDialog({ assetId, type = 'sidebar' }: AssetDialogProps) {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data: asset } = useQuery(
		trpc.asset.getById.queryOptions(assetId as number, {
			enabled: !!assetId,
		}),
	)
	const { data: exchanges } = useQuery(trpc.exchange.get.queryOptions())
	// const { data: sectors } = useQuery(trpc.sector.get.queryOptions())

	const assetCreator = useMutation(trpc.asset.create.mutationOptions())
	const assetUpdater = useMutation(trpc.asset.update.mutationOptions())

	const form = useForm<AssetCreate>({
		resolver: zodResolver(assetCreate),
		defaultValues: {
			exchangeId: asset?.exchangeId,
			ticker: asset?.ticker,
			type: asset?.type,
			description: asset?.description ?? undefined,
			name: asset?.name,
			// sectorIds: asset?.sectorIds ?? undefined,
		},
	})

	useEffect(() => {
		if (asset) {
			form.reset({
				exchangeId: asset.exchangeId,
				ticker: asset.ticker,
				type: asset.type,
				description: asset.description ?? undefined,
				name: asset.name,
				// sector: asset.sector ?? undefined,
				// currencyCode: asset.currencyCode,
			})
		}
	}, [asset, form])

	async function onSubmit(values: AssetCreate) {
		setIsLoading(true)
		try {
			if (assetId) {
				await assetUpdater.mutateAsync({
					id: assetId,
					...values,
				})
			} else {
				await assetCreator.mutateAsync({
					...values,
				})
			}

			await invalidateQuery(trpc.asset.get.queryKey())
			setOpen(false)
		} catch {
			if (assetId) {
				toast('Could not update asset')
			} else {
				toast('Could not create asset')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{assetId ?
					<Button variant='ghost' size='icon'>
						<PenIcon className='size-4' />
					</Button>
				: type === 'button-with-text' ?
					<Button variant='secondary'>
						<PlusIcon />
						Create asset
					</Button>
				: type === 'sidebar' ?
					<SidebarMenuItem>
						<SidebarMenuButton>
							<PlusSquareIcon className='size-4' />
							<span className='ml-2'>Add asset</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				: type === 'dropdown' ?
					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault()
							setOpen(true)
						}}
					>
						Asset
					</DropdownMenuItem>
				:	<Button variant='outline' size='icon'>
						<PlusIcon />
					</Button>
				}
			</DialogTrigger>

			<DialogContent className='p-8 sm:max-w-[425px]'>
				<AlertDialogHeader>
					<DialogTitle className='text-2xl font-bold'>
						{assetId ? 'Edit asset' : 'Add asset'}
					</DialogTitle>
				</AlertDialogHeader>
				<FormProvider {...form}>
					<form
						className='space-y-2'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='ticker'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Symbol</FormLabel>
									<FormControl>
										<Input {...field} placeholder='ID' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='exchangeId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Exchange</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={asset?.exchangeId.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Choose an exchange' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{exchanges && exchanges.length > 0 ?
												exchanges.map((exchange) => (
													<SelectItem
														key={exchange.id}
														value={exchange.id.toString()}
													>
														{exchange.name}
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
