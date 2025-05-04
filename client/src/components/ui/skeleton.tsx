import { HTMLAttributes } from 'react'

import { cn } from '@/helpers'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('bg-muted animate-pulse rounded-md', className)}
			{...props}
		/>
	)
}

export { Skeleton }
