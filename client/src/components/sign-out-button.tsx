import { trpc } from '~/clients'
import { cn } from '~/helpers'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { ClassValue } from 'clsx'

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
	const signOut = useMutation(trpc.user.signOut.mutationOptions())

	async function handleSignOutClick() {
		await signOut.mutateAsync()
		await router.invalidate()
	}

	return (
		<button className={cn(className)} onClick={handleSignOutClick}>
			{showText ? 'Log out' : <LogOutIcon />}
		</button>
	)
}
