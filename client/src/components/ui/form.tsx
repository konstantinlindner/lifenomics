import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	type HTMLAttributes,
	forwardRef,
} from 'react'

import { cn } from '~/helpers'
import { useFormField } from '~/hooks'

import type * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'

import { Label } from '~/components/ui'

const FormLabel = forwardRef<
	ElementRef<typeof LabelPrimitive.Root>,
	ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField()

	return (
		<Label
			ref={ref}
			className={cn(error && 'text-destructive', className)}
			htmlFor={formItemId}
			{...props}
		/>
	)
})
FormLabel.displayName = 'FormLabel'

const FormControl = forwardRef<
	ElementRef<typeof Slot>,
	ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField()

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error ? formDescriptionId : (
					`${formDescriptionId} ${formMessageId}`
				)
			}
			aria-invalid={!!error}
			{...props}
		/>
	)
})
FormControl.displayName = 'FormControl'

const FormDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField()

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
})
FormDescription.displayName = 'FormDescription'

const FormMessage = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField()
	const body = error ? String(error.message) : children

	if (!body) {
		return null
	}

	return (
		<p
			ref={ref}
			id={formMessageId}
			className={cn('text-destructive text-sm font-medium', className)}
			{...props}
		>
			{body}
		</p>
	)
})
FormMessage.displayName = 'FormMessage'

export { FormLabel, FormControl, FormDescription, FormMessage }
