import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dividends')({
	component: Dividends,
})

function Dividends() {
	return <div>Dividends!</div>
}
