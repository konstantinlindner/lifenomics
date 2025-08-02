import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/industries')({
	component: Industries,
})

function Industries() {
	return <div>Hello industries!</div>
}
