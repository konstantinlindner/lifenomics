import { cn } from '~/helpers'

import type { ClassValue } from 'clsx'

import { Loader2Icon } from 'lucide-react'

type LoadingIndicatorProps = {
	text?: string
	size?: 'sm' | 'md' | 'lg'
	color?: string
	className?: ClassValue
}

export function LoadingIndicator({
	text,
	size = 'md',
	color = '#FFFF',
	className,
}: LoadingIndicatorProps) {
	const sizeMap = {
		sm: '6',
		md: '8',
		lg: '12',
	}

	const svgSize = sizeMap[size]

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<Loader2Icon
				color={color}
				className={`animate-spin size-${svgSize}`}
			/>
			{text ?
				<p className={`text-${size}`}>{text}</p>
			:	null}
		</div>
	)
}
