import type { ReactNode } from 'react'

import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

import { emailTailwindConfig } from './tailwind-config'

type ChangeEmailConfirmationProps = {
	userName?: string | null
	newEmail: string
	confirmUrl: string
}

export function ChangeEmailConfirmation({
	userName,
	newEmail,
	confirmUrl,
}: ChangeEmailConfirmationProps): ReactNode {
	return (
		<Html>
			<Head />
			<Tailwind config={emailTailwindConfig}>
				<Body className='bg-[#f6f9fc] font-sans'>
					<Container className='mx-auto mb-16 bg-white p-10 px-5'>
						<Heading className='my-10 p-0 text-center text-2xl font-bold text-[#333]'>
							Confirm your email change
						</Heading>
						{userName ?
							<Text className='text-base leading-relaxed text-[#333]'>
								Hi {userName},
							</Text>
						:	null}
						<Text className='text-base leading-relaxed text-[#333]'>
							You requested to change your email address to{' '}
							<strong>{newEmail}</strong>. Click the button below
							to confirm.
						</Text>
						<Section className='my-8 text-center'>
							<Button
								className='rounded bg-[#5469d4] px-5 py-3 text-center text-base font-bold text-white no-underline'
								href={confirmUrl}
							>
								Confirm email change
							</Button>
						</Section>
						<Text className='text-base leading-relaxed text-[#333]'>
							If you did not request this change, ignore this
							email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
