import { useEffect, useState } from 'react'

export function CurrentTimeCell({ timezone }: { timezone: string }) {
	const [currentTime, setCurrentTime] = useState<string>('')

	useEffect(() => {
		const updateTime = () => {
			setCurrentTime(
				new Intl.DateTimeFormat('en-US', {
					timeZone: timezone,
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				}).format(new Date()),
			)
		}

		updateTime()

		const intervalId = setInterval(updateTime, 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [timezone])

	return <div>{currentTime}</div>
}
