import type { ReactNode } from 'react'

import { cn } from '~/helpers'

import { Link } from '@tanstack/react-router'
import type { ClassValue } from 'clsx'

import { Button, type ButtonProps } from '~/components/ui/button'

type ButtonLinkProps = {
	to: string
	variant?: ButtonProps['variant']
	className?: ClassValue
	children?: ReactNode
}

export function ButtonLink({
	to,
	variant = 'default',
	className,
	children,
}: ButtonLinkProps) {
	return (
		<Link to={to} className='rounded-md'>
			<Button variant={variant} className={cn(className)}>
				{children}
			</Button>
		</Link>
	)
}
