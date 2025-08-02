import { LoadingIndicator } from '~/components/loading-indicator'

export function LoadingScreen() {
	return (
		<div className='flex h-screen w-screen items-center justify-center'>
			<LoadingIndicator color='#000000' size='lg' />
		</div>
	)
}
