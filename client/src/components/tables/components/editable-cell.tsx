import { useState } from 'react'

type EditableCellProps = {
	value: string
	onChange: (newValue: string) => void
}

export function EditableCell({ value, onChange }: EditableCellProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [inputValue, setInputValue] = useState(value)

	const handleBlur = () => {
		setIsEditing(false)
		onChange(inputValue)
	}

	return isEditing ?
			<input
				type='text'
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onBlur={handleBlur}
				autoFocus
				className='bg-background p-1'
			/>
		:	<div onClick={() => setIsEditing(true)}>{value}</div>
}
