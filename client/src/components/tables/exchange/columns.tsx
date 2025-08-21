import type { ExchangeRouterOutput } from '@server/trpc/routers/exchange'

import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { ExternalLinkIcon } from 'lucide-react'

import { Button } from '~/components/ui'

import { AssetDialog } from '~/components'

import { ColumnHeader } from '../components/column-header'
import { CurrentTimeCell } from '../components/currentTimeCell'

export const columns: ColumnDef<ExchangeRouterOutput['get'][number]>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Name' />
		},
	},
	{
		accessorKey: 'shortName',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Short Name' />
		},
	},
	{
		accessorKey: 'timezone',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Timezone' />
		},
		cell: ({ row }) => {
			const timezoneName: string = row.getValue('timezoneName')
			const timezoneShortName: string = row.getValue('timezoneShortName')

			return <div>{`${timezoneName} (${timezoneShortName})`}</div>
		},
	},
	{
		accessorKey: 'timezoneName',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Timezone name' />
		},
	},
	{
		accessorKey: 'timezoneShortName',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Timezone short name' />
		},
	},
	{
		accessorKey: 'currentTime',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Current time' />
		},
		cell: ({ row }) => {
			return <CurrentTimeCell timezone={row.getValue('timezoneName')} />
		},
	},
	{
		accessorKey: 'country',
		header: ({ column }) => {
			return <ColumnHeader column={column} title='Country' />
		},
	},
	{
		accessorKey: 'city',
		header: () => {
			return <div>City</div>
		},
	},
	{
		accessorKey: 'emoji',
		header: () => {
			return <div>Emoji</div>
		},
	},
	{
		accessorKey: 'website',
		header: () => {
			return <div>Website</div>
		},
		cell: ({ row }) => {
			return (
				<Button
					variant='link'
					onClick={() => {
						window.open(row.getValue('website'), '_blank')
					}}
				>
					<ExternalLinkIcon /> Link
				</Button>
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
