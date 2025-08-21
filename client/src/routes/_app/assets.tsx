import { createFileRoute } from '@tanstack/react-router'

import { AssetTable } from '~/components'

export const Route = createFileRoute('/_app/assets')({
	component: Assets,
})

function Assets() {
	return (
		<main>
			<AssetTable />
		</main>
	)
}
