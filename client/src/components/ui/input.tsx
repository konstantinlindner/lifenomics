import { type InputHTMLAttributes, forwardRef } from 'react'

import { cn } from '~/helpers'

const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				'border-primary bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:primary-none flex h-8 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			ref={ref}
			{...props}
		/>
	)
})
Input.displayName = 'Input'

export { Input }
