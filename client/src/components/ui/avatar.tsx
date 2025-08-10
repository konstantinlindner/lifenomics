import type { ComponentProps } from 'react'

import { cn } from '~/helpers'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

function Avatar({
	className,
	...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
	return (
		<AvatarPrimitive.Root
			data-slot='avatar'
			className={cn(
				'relative flex size-10 shrink-0 overflow-hidden rounded-full',
				className,
			)}
			{...props}
		/>
	)
}

function AvatarImage({
	className,
	...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
	return (
		<AvatarPrimitive.Image
			data-slot='avatar-image'
			className={cn('aspect-square size-full', className)}
			{...props}
		/>
	)
}

function AvatarFallback({
	className,
	...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot='avatar-fallback'
			className={cn(
				'bg-secondary/20 flex size-full items-center justify-center rounded-md',
				className,
			)}
			{...props}
		/>
	)
}

export { Avatar, AvatarImage, AvatarFallback }
