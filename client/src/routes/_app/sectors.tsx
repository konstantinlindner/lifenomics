import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sectors')({
	component: Sectors,
})

function Sectors() {
	return <div>Hello sectors!</div>
}
