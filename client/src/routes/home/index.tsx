import { useUser } from '@/contexts'

export function Home() {
	const { user } = useUser()

	return (
		<main className='mr-10 mt-20 w-screen'>
			<div className='flex flex-col'>
				<h1 className='my-2 text-3xl'>Home</h1>
				<p>
					Welcome{' '}
					<span className='text-primary font-semibold'>
						{user?.firstName}
					</span>
				</p>
			</div>
		</main>
	)
}
