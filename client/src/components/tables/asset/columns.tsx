import type { AssetRouterOutput } from '@server/trpc/routers/asset'

import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { Badge } from '~/components/ui'

import { AssetDialog } from '~/components'

import { ColumnHeader } from '../components/column-header'

export const columns: ColumnDef<AssetRouterOutput['get'][number]>[] = [
	{
		accessorKey: 'shortName',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Name' />
		},
	},
	{
		accessorKey: 'ticker',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Ticker' />
		},
	},
	{
		accessorKey: 'portfolioId',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Owned' />
		},
		cell: ({ row }) => {
			return (
				<Badge
					variant={
						row.getValue('portfolioId') ? 'default' : 'outline'
					}
				>
					{row.getValue('portfolioId') ? 'Yes' : 'No'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Created' />
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
			return <ColumnHeader column={column} title='Updated' />
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
