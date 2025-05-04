import { useEffect, useState } from 'react'

import { invalidateQuery } from '@/clients'
import { createAsset, getAssetById, getPortfolios, updateAsset } from '@/fetch'

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

type AssetDialogProps = {
	assetId?: number // if an assetId is passed in, the component will be in edit mode
	type?: 'button' | 'button-with-text' | 'sidebar'
	portfolioId?: number
}

export function AssetDialog({
	assetId,
	type = 'sidebar',
	portfolioId,
}: AssetDialogProps) {
	const [open, setOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data: asset } = useQuery({
		queryKey: ['getAssetById', assetId],
		queryFn: () => getAssetById(assetId as number),
		enabled: !!assetId,
	})

	const { data: portfolios } = useQuery({
		queryKey: ['getPortfolios'],
		queryFn: () => getPortfolios(),
	})

	const formSchema = z.object({
		ticker: z.string().trim().min(2),
		portfolioId: z.number(),
	})

	type Form = z.infer<typeof formSchema>

	const form = useForm<Form>({
		resolver: zodResolver(formSchema),
	})

	useEffect(() => {
		if (asset) {
			form.reset({
				ticker: asset.ticker,
				portfolioId: asset.portfolioId,
			})
		}
	}, [asset, form])

	async function onSubmit(values: Form) {
		setIsLoading(true)

		const asset =
			assetId ?
				await updateAsset({
					id: assetId,
					...values,
				})
			:	await createAsset({
					...values,
				})

		if (!asset) {
			toast(
				assetId ?
					'Could not update asset, please try again'
				:	'Could not create asset, please try again',
			)

			setIsLoading(false)
			return
		}

		await invalidateQuery(['getAssets'])
		await invalidateQuery(['getAssets', portfolioId])

		setIsLoading(false)
		setOpen(false)
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
				:	<Button variant='secondary'>
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
				<Form {...form}>
					<form
						className='space-y-2'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='ticker'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ticker</FormLabel>
									<FormControl>
										<Input {...field} placeholder='ID' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='portfolioId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Portfolio</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={asset?.portfolioId.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Choose a portfolio' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{(
												portfolios &&
												portfolios.length > 0
											) ?
												portfolios.map((portfolio) => (
													<SelectItem
														key={portfolio.id}
														value={portfolio.id.toString()}
													>
														{portfolio.name}
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
