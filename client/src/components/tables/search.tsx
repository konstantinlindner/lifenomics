import { SearchIcon } from 'lucide-react'

import { Input } from '~/components/ui'

type SearchProps = {
	value: string
	onChange: (value: string) => void
	placeholder?: string
}

export function Search({
	value,
	onChange,
	placeholder = 'Search...',
}: SearchProps) {
	return (
		<div className='relative'>
			<SearchIcon className='text-primary absolute left-2 top-2 size-5' />
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					onChange(e.target.value)
				}}
				className='pl-10'
			/>
		</div>
	)
}
