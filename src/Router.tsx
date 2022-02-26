import Home from 'components/containers/Home'
import SignIn from 'components/containers/SignIn'
import SignUp from 'components/containers/SignUp'
import React, { createContext } from 'react'
import { FC } from 'react'
import {
	Navigate,
	Outlet,
	Route,
	BrowserRouter,
	Routes,
} from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { AuthContextType, useAuth } from 'utils/services/auth'
import { User } from 'utils/services/models'

export const AuthContext = createContext<AuthContextType>({
	user: null,
	signIn: (_a: string, _b: string): Promise<void> => Promise.resolve(),
	signUp: (_a: string, _b: string): Promise<void> => Promise.resolve(),
	signOut: (): Promise<void> => Promise.resolve(),
})

const RequireAuth: FC<{ user: User | null | undefined }> = props => {
	const { user } = props

	// TODO: Loading screen
	if (user === undefined) return <></>

	if (user === null) {
		return <Navigate to={Paths.signin} />
	}

	return <Outlet />
}

const Router: FC = () => {
	const authContext = useAuth()

	return (
		<AuthContext.Provider value={authContext}>
			<BrowserRouter>
				<Routes>
					<Route path='*' element={<p>Page 404</p>} />
					<Route path={Paths.signin} element={<SignIn />} />
					<Route path={Paths.signup} element={<SignUp />} />

					{/* PROTECTED ROUTES */}
					<Route element={<RequireAuth user={authContext.user} />}>
						<Route path={Paths.home} element={<Home />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthContext.Provider>
	)
}

export default Router
