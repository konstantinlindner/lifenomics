import { type ChangeEvent, useState } from 'react'

import { trpc } from '~/clients'
import { log } from '~/helpers'
import { useUser } from '~/hooks'

import { useMutation, useQuery } from '@tanstack/react-query'
import { TRPCClientError } from '@trpc/client'
import dayjs from 'dayjs'
import { toast } from 'sonner'

import { PencilIcon } from 'lucide-react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
	Input,
	Label,
} from '~/components/ui'

import { LoadingIndicator } from './loading-indicator'

export function ProfilePicturePicker() {
	const { user } = useUser()
	const [open, setOpen] = useState(false)
	const [isUploading, setIsUploading] = useState(false)

	const { data: profileImageFolderUrl } = useQuery(
		trpc.user.getProfileImageFolderUrl.queryOptions(),
	)
	const updateUser = useMutation(trpc.user.update.mutationOptions())
	const getProfileImageUploadUrl = useMutation(
		trpc.user.getProfileImageUploadUrl.mutationOptions(),
	)

	if (!user) {
		return
	}

	const avatarUrl = user.avatarUrl
	const fullName = `${user.firstName} ${user.lastName}`

	const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setIsUploading(true)

		try {
			const file = event.target.files?.[0]
			if (!file) {
				return
			}

			if (file.size > 10 * 1024 * 1024) {
				setIsUploading(false)
				toast('The image must be smaller than 10MB')
				return
			}

			const dateTime = dayjs().format('YYYY-MM-DD-HH-mm-ss')

			const presignedUrl =
				await getProfileImageUploadUrl.mutateAsync(dateTime)

			if (!presignedUrl) {
				setIsUploading(false)
				toast('Något gick fel, försök igen')
				return
			}

			const response = await fetch(presignedUrl, {
				method: 'PUT',
				body: file,
			})

			if (!response.ok) {
				setIsUploading(false)
				toast('Something went wrong, please try again')
				return
			}

			if (!profileImageFolderUrl) {
				setIsUploading(false)
				toast('Something went wrong, please try again')
				return
			}

			await updateUser.mutateAsync({
				avatarUrl: `${profileImageFolderUrl}${dateTime}`,
			})

			setOpen(false)
			window.location.reload()
		} catch (error) {
			if (error instanceof TRPCClientError) {
				toast(error.message)
				return
			}

			log(error)
			toast('Something went wrong, please try again')
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='size-40 rounded-full'>
					<div className='relative flex size-40 items-center justify-center rounded-full'>
						<Avatar className='size-40'>
							<AvatarImage src={avatarUrl ?? ''} alt={fullName} />
							<AvatarFallback className='bg-muted-foreground text-5xl text-white'>
								<PencilIcon strokeWidth='3' size={36} />
							</AvatarFallback>
						</Avatar>
						<div className='absolute bottom-0 left-0 right-0 top-0 flex size-40 items-center justify-center rounded-full text-white opacity-0 hover:opacity-100'>
							<PencilIcon strokeWidth='3' size={36} />
						</div>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<div className='grid w-full max-w-sm items-center gap-4'>
					<Label htmlFor='image'>
						{isUploading ? 'Uploading...' : 'Upload image'}
					</Label>
					{isUploading ?
						<LoadingIndicator size='sm' />
					:	<Input
							className='h-10 bg-gray-300 text-black'
							id='image'
							type='file'
							accept='image/*'
							onChange={(event) => {
								void handleChange(event)
							}}
						/>
					}
				</div>
			</DialogContent>
		</Dialog>
	)
}
