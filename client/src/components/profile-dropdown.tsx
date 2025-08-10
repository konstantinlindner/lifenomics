import { trpc } from '~/clients'
import { useUser } from '~/hooks'

import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui'

export function ProfileDropdown() {
	const router = useRouter()
	const signOut = useMutation(trpc.user.signOut.mutationOptions())
	const { user } = useUser()

	if (!user) return null

	async function handleSignOutClick() {
		await signOut.mutateAsync()
		await router.invalidate()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='cursor-pointer'>
					<AvatarImage src={user.avatarUrl ?? undefined} />
					<AvatarFallback>
						{user.firstName.charAt(0)}
						{user.lastName.charAt(0)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuGroup>
					<Link to='/profile'>
						<DropdownMenuItem>Profile</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOutClick}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
