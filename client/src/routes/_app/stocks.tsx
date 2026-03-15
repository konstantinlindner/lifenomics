import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/stocks')({
	component: Stocks,
})

function Stocks() {
	return (
		<main>
			<Outlet />
		</main>
	)
}
