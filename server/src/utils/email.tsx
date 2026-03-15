import { env } from '~/env'

import { render } from '@react-email/render'
import { Resend } from 'resend'
import { ChangeEmailConfirmation } from '~/emails/change-email-confirmation'
import { PasswordResetSuccessEmail } from '~/emails/password-reset-success-email'
import { ResetPasswordEmail } from '~/emails/reset-password-email'
import { VerificationEmail } from '~/emails/verification-email'

const resend = new Resend(env.RESEND_API_KEY)

type SendEmailBase = {
	to: string
	subject: string
	text: string
}

export type SendVerifyEmail = SendEmailBase & {
	verifyUrl: string
	userName?: string | null
}

export type SendResetPasswordEmail = SendEmailBase & {
	resetUrl: string
	userName?: string | null
}

export type SendPasswordResetSuccessEmail = SendEmailBase & {
	userName?: string | null
}

export type SendChangeEmailConfirmation = SendEmailBase & {
	confirmUrl: string
	newEmail: string
	userName?: string | null
}

export type SendEmailProps =
	| SendVerifyEmail
	| SendResetPasswordEmail
	| SendPasswordResetSuccessEmail
	| SendChangeEmailConfirmation

function isVerifyEmail(props: SendEmailProps): props is SendVerifyEmail {
	return 'verifyUrl' in props && typeof props.verifyUrl === 'string'
}

function isResetPassword(
	props: SendEmailProps,
): props is SendResetPasswordEmail {
	return 'resetUrl' in props && typeof props.resetUrl === 'string'
}

function isChangeEmailConfirmation(
	props: SendEmailProps,
): props is SendChangeEmailConfirmation {
	return (
		'confirmUrl' in props
		&& typeof props.confirmUrl === 'string'
		&& 'newEmail' in props
		&& typeof props.newEmail === 'string'
	)
}

async function renderEmailHtml(props: SendEmailProps): Promise<string> {
	if (isVerifyEmail(props)) {
		return await render(
			<VerificationEmail
				verifyUrl={props.verifyUrl}
				userName={props.userName}
			/>,
		)
	}
	if (isResetPassword(props)) {
		return await render(
			<ResetPasswordEmail
				resetUrl={props.resetUrl}
				userName={props.userName}
			/>,
		)
	}
	if (isChangeEmailConfirmation(props)) {
		return await render(
			<ChangeEmailConfirmation
				confirmUrl={props.confirmUrl}
				newEmail={props.newEmail}
				userName={props.userName}
			/>,
		)
	}
	return await render(<PasswordResetSuccessEmail userName={props.userName} />)
}

/**
 * Sends an email via Resend using React Email templates.
 */
export async function sendEmail(props: SendEmailProps): Promise<void> {
	const { to, subject, text } = props
	const html = await renderEmailHtml(props)

	const { error } = await resend.emails.send({
		from: 'Lifenomics <hello@konstantin.app>',
		to,
		subject,
		text,
		html,
	})

	if (error) {
		console.error('[Resend] Failed to send email:', { to, subject, error })
		throw new Error(error.message)
	}
}
