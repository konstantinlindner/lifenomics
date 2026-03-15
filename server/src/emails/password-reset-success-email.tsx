import type { ReactNode } from 'react'

import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

import { emailTailwindConfig } from './tailwind-config'

type PasswordResetSuccessEmailProps = {
	userName?: string | null
}

export function PasswordResetSuccessEmail({
	userName,
}: PasswordResetSuccessEmailProps): ReactNode {
	return (
		<Html>
			<Head />
			<Tailwind config={emailTailwindConfig}>
				<Body className='bg-[#f6f9fc] font-sans'>
					<Container className='mx-auto mb-16 bg-white p-10 px-5'>
						<Heading className='my-10 p-0 text-center text-2xl font-bold text-[#333]'>
							Password reset successful
						</Heading>
						{userName ?
							<Text className='text-base leading-relaxed text-[#333]'>
								Hi {userName},
							</Text>
						:	null}
						<Text className='text-base leading-relaxed text-[#333]'>
							Your password has been reset successfully. You can
							now sign in with your new password.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
