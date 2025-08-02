import type { AssetRouterOutput } from '@server/trpc/routers/asset'

import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { ArrowUpDownIcon } from 'lucide-react'

import { Button } from '~/components/ui'

import { AssetDialog } from '~/components'

export const columns: ColumnDef<AssetRouterOutput['getAll'][number]>[] = [
	{
		accessorKey: 'ticker',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === 'asc')
					}}
				>
					Ticker
					<ArrowUpDownIcon />
				</Button>
			)
		},
	},
	{
		accessorKey: 'portfolioId',
		header: () => {
			return <Button variant='ghost'>Portfolio id</Button>
		},
		cell: ({ row }) => {
			return <div>{row.getValue('portfolioId')}</div>
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === 'asc')
					}}
				>
					Created at
					<ArrowUpDownIcon />
				</Button>
			)
		},
		cell: ({ row }) => {
			const createdAt = dayjs(row.getValue('createdAt')).format(
				'YYYY-MM-DD',
			)

			return <div>{createdAt}</div>
		},
	},
	{
		accessorKey: 'updatedAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === 'asc')
					}}
				>
					Updated at
					<ArrowUpDownIcon />
				</Button>
			)
		},
		cell: ({ row }) => {
			const updatedAt = dayjs(row.getValue('updatedAt')).format(
				'YYYY-MM-DD',
			)

			return <div>{updatedAt}</div>
		},
	},
	{
		id: 'edit',
		cell: ({ row }) => {
			return <AssetDialog assetId={row.original.id} />
		},
	},
]
