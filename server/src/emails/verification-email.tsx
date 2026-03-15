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

type VerificationEmailProps = {
	userName?: string | null
	verifyUrl: string
}

export function VerificationEmail({
	userName,
	verifyUrl,
}: VerificationEmailProps): ReactNode {
	return (
		<Html>
			<Head />
			<Tailwind config={emailTailwindConfig}>
				<Body className='bg-[#f6f9fc] font-sans'>
					<Container className='mx-auto mb-16 bg-white p-10 px-5'>
						<Heading className='my-10 p-0 text-center text-2xl font-bold text-[#333]'>
							Verify your email address
						</Heading>
						{userName ?
							<Text className='text-base leading-relaxed text-[#333]'>
								Hi {userName},
							</Text>
						:	null}
						<Text className='text-base leading-relaxed text-[#333]'>
							Please click the button below to verify your email
							address.
						</Text>
						<Section className='my-8 text-center'>
							<Button
								className='rounded bg-[#5469d4] px-5 py-3 text-center text-base font-bold text-white no-underline'
								href={verifyUrl}
							>
								Verify email
							</Button>
						</Section>
						<Text className='text-base leading-relaxed text-[#333]'>
							If you did not create an account, ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
