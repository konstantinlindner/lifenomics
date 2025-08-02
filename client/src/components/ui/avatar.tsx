import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	forwardRef,
} from 'react'

import { cn } from '~/helpers'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

const Avatar = forwardRef<
	ElementRef<typeof AvatarPrimitive.Root>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn(
			'size-15 relative flex shrink-0 overflow-hidden rounded-full',
			className,
		)}
		{...props}
	/>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = forwardRef<
	ElementRef<typeof AvatarPrimitive.Image>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn('aspect-square size-full', className)}
		{...props}
	/>
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = forwardRef<
	ElementRef<typeof AvatarPrimitive.Fallback>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			'bg-secondary flex size-full items-center justify-center rounded-md',
			className,
		)}
		{...props}
	/>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
