import { ChartSplineIcon } from 'lucide-react'

type LogoProps = {
	hideText?: boolean
}

export function Logo({ hideText }: LogoProps) {
	return (
		<div className='flex items-center'>
			<ChartSplineIcon className='size-7' />

			{!hideText && (
				<div className='select-none'>
					<span className='ml-2 text-xl font-bold'>Life</span>
					<span className='text-xl'>nomics</span>
				</div>
			)}
		</div>
	)
}
