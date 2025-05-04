import { StrictMode } from 'react'

import { AdminGuard, AuthGuard } from '@/auth'
import {
	Admin,
	Assets,
	Companies,
	Dividends,
	ErrorPage,
	Home,
	Portfolio,
	Portfolios,
	Profile,
	Root,
	SignIn,
	SignUp,
	Transactions,
} from '@/routes'

import '@/styles/globals.css'

import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'

import App from './App.tsx'

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<AuthGuard auth='Require'>
				<Root />
			</AuthGuard>
		),
		errorElement: (
			<AuthGuard auth='None'>
				<ErrorPage />
			</AuthGuard>
		),
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: 'portfolios',
				element: <Portfolios />,
			},
			{
				path: 'portfolios/:portfolioId',
				element: <Portfolio />,
			},
			{
				path: 'assets',
				element: <Assets />,
			},
			{
				path: 'transactions',
				element: <Transactions />,
			},
			{
				path: 'dividends',
				element: <Dividends />,
			},
			{
				path: 'companies',
				element: <Companies />,
			},
			{
				path: 'admin',
				element: (
					<AdminGuard>
						<Admin />
					</AdminGuard>
				),
			},
			{
				path: 'profile',
				element: <Profile />,
			},
		],
	},
	{
		path: 'sign-in',
		element: (
			<AuthGuard auth='Forbid'>
				<SignIn />
			</AuthGuard>
		),
	},
	{
		path: 'sign-up',
		element: (
			<AuthGuard auth='Forbid'>
				<SignUp />
			</AuthGuard>
		),
	},
])

const rootElement = document.querySelector('#root')

if (!rootElement) {
	throw new Error('No root element found')
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<App router={router} />
		</StrictMode>,
	)
}
