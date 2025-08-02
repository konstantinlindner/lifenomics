import { cn } from '~/helpers'
import { useTheme } from '~/hooks'

import { MoonIcon, SunMediumIcon } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui'

type ThemeToggleProps = {
	dropdown?: boolean
	isRound?: boolean
}

export function ThemeToggle({
	dropdown = false,
	isRound = false,
}: ThemeToggleProps) {
	const { setTheme, theme } = useTheme()

	return dropdown ?
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon' className='relative'>
						<SunMediumIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
						<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
						<span className='sr-only'>Change theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem
						onClick={() => {
							setTheme('light')
						}}
					>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setTheme('dark')
						}}
					>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setTheme('system')
						}}
					>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		:	<Button
				className={cn('relative size-9', isRound && 'rounded-full')}
				onClick={() => {
					setTheme(theme === 'dark' ? 'light' : 'dark')
				}}
				variant='ghost'
				size='icon'
			>
				<SunMediumIcon className='absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<MoonIcon className='absolute size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />

				<span className='sr-only'>Toggle theme</span>
			</Button>
}
