import AuthHome from 'AuthHome'
import Account from 'components/containers/Account'
import ChannelDetail from 'components/containers/ChannelDetail'
import CreateAccount from 'components/containers/CreateAccount'
import Home from 'components/containers/Home'
import LocalChannelDetail from 'components/containers/LocalChannelDetail'
import Nearby from 'components/containers/Nearby'
import ServerDetail from 'components/containers/ServerDetail'
import SignIn from 'components/containers/SignIn'
import React, { createContext } from 'react'
import { FC } from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { AuthContextType, useAuth } from 'utils/services/auth'

export const AuthContext = createContext<AuthContextType>({
	user: null,
	signIn: (_a: string, _b: string): Promise<void> => Promise.resolve(),
	createAccount: (_a: string, _b: string, _c: string): Promise<void> =>
		Promise.resolve(),
	signOut: (): Promise<void> => Promise.resolve(),
	syncUser: (): Promise<void> => Promise.resolve(),
})

const Router: FC = () => {
	const authContext = useAuth()

	return (
		<AuthContext.Provider value={authContext}>
			<BrowserRouter>
				<Routes>
					<Route path='*' element={<p>Page 404</p>} />
					<Route path={Paths.signin} element={<SignIn />} />
					<Route path={Paths.createAccount} element={<CreateAccount />} />

					{/* PROTECTED ROUTES */}
					<Route element={<AuthHome user={authContext.user} />}>
						<Route path={Paths.home} element={<Home />} />
						<Route path={Paths.server} element={<ServerDetail />} />
						<Route path={Paths.channel} element={<ChannelDetail />} />
						<Route path={Paths.localChannel} element={<LocalChannelDetail />} />
						<Route path={Paths.account} element={<Account />} />
						<Route path={Paths.nearby} element={<Nearby />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthContext.Provider>
	)
}

export default Router
