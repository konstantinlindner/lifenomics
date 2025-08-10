import { useState } from 'react'

import { XIcon } from 'lucide-react'

import { Button, Dialog, DialogContent, DialogTrigger } from '~/components/ui'

type DeleteDialogProps = {
	handleClick: () => Promise<void>
	message: string
}

export function DeleteDialog({ message, handleClick }: DeleteDialogProps) {
	const [open, setOpen] = useState(false)

	async function handleButtonPress() {
		await handleClick()

		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className='data-[state=open]:bg-muted flex size-8 p-0'
				>
					<XIcon className='size-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='p-8 sm:max-w-[425px]'>
				<p>{message}</p>
				<Button variant='destructive' onClick={handleButtonPress}>
					Delete
				</Button>
			</DialogContent>
		</Dialog>
	)
}
