import { Loader2Icon } from 'lucide-react'

type LoadingIndicatorProps = {
	text?: string
	size?: 'sm' | 'md' | 'lg'
}

export function LoadingIndicator({ text, size = 'md' }: LoadingIndicatorProps) {
	const sizeMap = {
		sm: '6',
		md: '8',
		lg: '12',
	} as const

	const svgSize = sizeMap[size]

	return (
		<div className='flex items-center gap-2'>
			<Loader2Icon className={`animate-spin size-${svgSize}`} />
			{text && <p className={`text-${size}`}>{text}</p>}
		</div>
	)
}
