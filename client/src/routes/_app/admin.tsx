import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin')({
	component: Admin,
})

function Admin() {
	return <div>Hello admin!</div>
}
