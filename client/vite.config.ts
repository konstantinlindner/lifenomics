import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@/auth': path.resolve(__dirname, './src/auth'),
			'@/clients': path.resolve(__dirname, './src/clients'),
			'@/components': path.resolve(__dirname, './src/components'),
			'@/contexts': path.resolve(__dirname, './src/contexts'),
			'@/fetch': path.resolve(__dirname, './src/fetch'),
			'@/helpers': path.resolve(__dirname, './src/helpers'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/routes': path.resolve(__dirname, './src/routes'),
			'@/styles': path.resolve(__dirname, './src/styles'),
		},
	},
})
