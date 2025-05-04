import {
	SignInInput,
	SignUpInput,
	UserRouterInput,
} from '@/server/trpc/routers/userRouter'

import { TRPCClient, isTRPCClientError } from '@/clients'
import { log } from '@/helpers'

export async function signIn(props: SignInInput) {
	try {
		await TRPCClient.userRouter.signIn.mutate(props)

		return 'SUCCESS'
	} catch (error) {
		log(error)

		if (isTRPCClientError(error) && error.data) {
			return error.data.code
		}

		return 'UNKNOWN_ERROR'
	}
}

export async function signUp(props: SignUpInput) {
	try {
		await TRPCClient.userRouter.signUp.mutate(props)

		return 'SUCCESS'
	} catch (error) {
		log(error)

		if (isTRPCClientError(error) && error.data) {
			return error.data.code
		}

		return 'UNKNOWN_ERROR'
	}
}

export async function signOut() {
	try {
		await TRPCClient.userRouter.signOut.mutate()

		return 'SUCCESS'
	} catch (error) {
		log(error)

		if (isTRPCClientError(error) && error.data) {
			return error.data.code
		}

		return 'UNKNOWN_ERROR'
	}
}

export async function getUser() {
	return await TRPCClient.userRouter.getUser.query()
}

export async function updateUser(params: UserRouterInput['update']) {
	try {
		return await TRPCClient.userRouter.update.mutate(params)
	} catch (error) {
		log(error)
		return null
	}
}

export async function getProfileImageUploadUrl(key: string) {
	try {
		return await TRPCClient.userRouter.getProfileImageUploadUrl.mutate(key)
	} catch (error) {
		log(error)
		return null
	}
}

export async function getProfileImageFolderUrl() {
	try {
		return await TRPCClient.userRouter.getProfileImageFolderUrl.query()
	} catch (error) {
		log(error)
		return null
	}
}
