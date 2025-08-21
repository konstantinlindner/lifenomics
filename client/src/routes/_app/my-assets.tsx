import { createFileRoute } from '@tanstack/react-router'

import { OwnedAssetTable } from '~/components'

export const Route = createFileRoute('/_app/my-assets')({
	component: MyAssets,
})

function MyAssets() {
	return (
		<main>
			<OwnedAssetTable />
		</main>
	)
}
