import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/currencies')({
	component: Currencies,
})

function Currencies() {
	return <div>Hello currencies!</div>
}
