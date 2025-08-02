import type { ReactNode } from 'react'

type TableWrapperProps = {
	name: string
	children: ReactNode
}

export default function TableWrapper({ name, children }: TableWrapperProps) {
	return (
		<div className='w-full rounded-2xl border'>
			<div className='p-5'>
				<h1 className='flex items-center gap-3 text-xl font-bold'>
					{name}
				</h1>
			</div>
			<div>{children}</div>
		</div>
	)
}
