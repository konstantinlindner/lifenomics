import { cn } from '~/helpers'

import { useRouter } from '@tanstack/react-router'
import type { ClassValue } from 'clsx'
import { authClient } from '~/lib/auth-client'

import { LogOutIcon } from 'lucide-react'

type SignOutButtonProps = {
	className?: ClassValue
	showText?: boolean
}

export function SignOutButton({
	className,
	showText = false,
}: SignOutButtonProps) {
	const router = useRouter()

	async function handleSignOutClick() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					void router.invalidate()
				},
			},
		})
	}

	return (
		<button className={cn(className)} onClick={handleSignOutClick}>
			{showText ? 'Log out' : <LogOutIcon />}
		</button>
	)
}
