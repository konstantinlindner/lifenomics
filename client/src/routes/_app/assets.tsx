import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/assets')({
	component: Assets,
})

function Assets() {
	return <div>Hello assets</div>
}
