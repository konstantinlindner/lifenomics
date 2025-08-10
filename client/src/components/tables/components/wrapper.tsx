import type { ReactNode } from 'react'

type WrapperProps = {
	children: ReactNode
	tableName: string
	icon?: ReactNode
}

export function Wrapper({ children, tableName, icon }: WrapperProps) {
	return (
		<div className='bg-card rounded-2xl border'>
			<div className='p-5'>
				<h1 className='text-primary flex items-center gap-3 text-xl font-bold'>
					{icon && <div>{icon}</div>}
					{tableName}
				</h1>
			</div>
			{children}
		</div>
	)
}
