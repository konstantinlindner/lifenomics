import { useState } from 'react'

import { cn } from '@/helpers'

import dayjs from 'dayjs'

import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

type DatePickerProps = {
	fromYear: number
	toYear: number
	initialDate?: Date | undefined
	handleDateChange: (date: Date) => void
}

export function DatePicker({
	initialDate,
	fromYear,
	toYear,
	handleDateChange,
}: DatePickerProps) {
	const [date, setDate] = useState<Date | undefined>(initialDate)
	const [stringDate, setStringDate] = useState(
		initialDate ? dayjs(initialDate).format('DD/MM/YYYY') : '',
	)
	// const [errorMessage, setErrorMessage] = useState<string>('');

	function handleDateChangeInternal(date: Date) {
		setDate(date)
		handleDateChange(date)
	}

	return (
		<Popover key={date?.getDate()}>
			<div className='relative w-[290px]'>
				<Input
					type='string'
					value={stringDate}
					onFocus={() => {
						if (date)
							setStringDate(dayjs(date).format('DD/MM/YYYY'))
					}}
					onChange={(e) => {
						if (date) setStringDate('')
						setStringDate(e.target.value)
					}}
					onBlur={(e) => {
						const parsedDate = new Date(e.target.value)
						if (parsedDate.toString() === 'Invalid Date') {
							// todo
							// setErrorMessage('Invalid date');
						} else {
							// setErrorMessage('');
							handleDateChangeInternal(parsedDate)
							setStringDate(
								dayjs(parsedDate).format('DD/MM/YYYY'),
							)
						}
					}}
				/>
				{/* {errorMessage !== '' && (
          <div className="absolute bottom-[-1.75rem] left-0 text-red-400 text-sm">
            {errorMessage}
          </div>
        )} */}
				<PopoverTrigger asChild>
					<Button
						className={cn(
							'absolute right-0 top-[50%] translate-y-[-50%] rounded-l-none font-normal',
							!date && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className='size-4' />
					</Button>
				</PopoverTrigger>
			</div>
			<PopoverContent align='end' className='w-auto p-0'>
				<Calendar
					mode='single'
					captionLayout='dropdown-buttons'
					selected={date}
					defaultMonth={date}
					onSelect={(selectedDate) => {
						if (!selectedDate) {
							return
						}

						handleDateChangeInternal(selectedDate)
						setStringDate(dayjs(selectedDate).format('DD/MM/YYYY'))
						// setErrorMessage('');
					}}
					fromYear={fromYear}
					toYear={toYear}
				/>
			</PopoverContent>
		</Popover>
	)
}
