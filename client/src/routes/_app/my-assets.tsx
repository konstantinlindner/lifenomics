import { createFileRoute } from '@tanstack/react-router'

import { AssetTable } from '~/components'

export const Route = createFileRoute('/_app/my-assets')({
	component: MyAssets,
})

function MyAssets() {
	return (
		<main>
			<AssetTable />
		</main>
	)
}
