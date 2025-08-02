import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/exchanges')({
	component: Exchanges,
})

function Exchanges() {
	return <div>Hello exchanges</div>
}
