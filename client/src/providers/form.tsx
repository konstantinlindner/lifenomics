import { type HTMLAttributes, forwardRef, useId } from 'react'

import { FormFieldContext, FormItemContext } from '~/contexts'
import { cn } from '~/helpers'

import {
	Controller,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'

export const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	)
}

export const FormItem = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const id = useId()

	return (
		<FormItemContext.Provider value={{ id }}>
			<div ref={ref} className={cn('space-y-2', className)} {...props} />
		</FormItemContext.Provider>
	)
})
FormItem.displayName = 'FormItem'
