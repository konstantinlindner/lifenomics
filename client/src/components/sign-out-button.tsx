import { signOut } from '@/fetch'
import { cn } from '@/helpers'

import { useNavigate } from 'react-router-dom'

import { LogOutIcon } from 'lucide-react'

import { SidebarMenuButton } from '@/components/ui/sidebar'

type SignOutButtonProps = {
	showText?: boolean
	className?: string
}

export function SignOutButton({ showText, className }: SignOutButtonProps) {
	const navigate = useNavigate()

	async function handleSignOutClick() {
		await signOut()
		navigate('/sign-in')
		navigate(0)
	}

	return (
		<SidebarMenuButton
			className={cn(
				'bg-secondary/60 flex-grow items-center justify-center p-4',
				className,
			)}
			onClick={handleSignOutClick}
		>
			{showText && 'Sign out'}
			<LogOutIcon
				color='white'
				width={20}
				height={20}
				className={cn(showText && 'ml-3')}
			/>
		</SidebarMenuButton>
	)
}
