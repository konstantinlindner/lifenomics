import { createFileRoute } from '@tanstack/react-router'

import { ProfileUpdateForm } from '~/components'

export const Route = createFileRoute('/_app/profile')({
	component: Profile,
})

function Profile() {
	return (
		<main className='flex h-full flex-1 flex-col gap-6 py-6'>
			<div className='h-full max-w-2xl'>
				<ProfileUpdateForm />
			</div>
		</main>
	)
}
