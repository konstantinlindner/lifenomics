import { ChangeEvent, useState } from 'react'

import { useUser } from '@/contexts'
import {
	getProfileImageFolderUrl,
	getProfileImageUploadUrl,
	updateUser,
} from '@/fetch'

import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { PencilIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { LoadingIndicator } from '@/components'

export function ProfilePicturePicker() {
	const navigate = useNavigate()
	const { user } = useUser()
	const [open, setOpen] = useState(false)
	const [isUploading, setIsUploading] = useState(false)

	if (!user) {
		return
	}

	const avatarUrl = user.avatarUrl
	const fullName = `${user.firstName} ${user.lastName}`

	const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setIsUploading(true)

		const file = event.target.files?.[0]
		if (!file) {
			return
		}

		if (file.size > 10 * 1024 * 1024) {
			setIsUploading(false)
			toast('Bilden får inte vara större än 10MB')
			return
		}

		const dateTime = dayjs().format('YYYY-MM-DD-HH-mm-ss')

		const presignedUrl = await getProfileImageUploadUrl(dateTime)

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
			toast('Something went wrong, try again')
			return
		}

		const folderUrl = await getProfileImageFolderUrl()

		if (!folderUrl) {
			setIsUploading(false)
			toast('Something went wrong, try again')
			return
		}

		await updateUser({
			avatarUrl: `${folderUrl}${dateTime}`,
		})

		setIsUploading(false)
		setOpen(false)
		navigate(0)
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
