import { useEffect, useState } from 'react'
import { User } from './models'
import {
	AuthError,
	getAuth,
	signInWithEmailAndPassword,
	signOut as fireSignOut,
	User as FireUser,
} from 'firebase/auth'
import { firebaseApp } from './firebase'
import { getMessage } from './errors'

export interface AuthContextType {
	user: User | null | undefined
	signIn: (email: string, password: string) => Promise<void>
	signUp: (email: string, password: string, name: string) => Promise<void>
	signOut: () => Promise<void>
}

const auth = getAuth(firebaseApp)

const formatUser = (user: FireUser | null): User | null => {
	if (user)
		return {
			id: user.uid,
			name: user.displayName,
			email: user.email,
			phone: user.phoneNumber,
			lastSignIn:
				(user.metadata.lastSignInTime &&
					new Date(user.metadata.lastSignInTime)) ||
				undefined,
		}
	else return null
}

export const useAuth = (): AuthContextType => {
	const [user, setUser] = useState<User | null | undefined>(undefined)

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			setUser(formatUser(user))
		})
	}, [])

	const signIn = async (email: string, password: string): Promise<void> => {
		try {
			await signInWithEmailAndPassword(auth, email, password)
		} catch (e) {
			return Promise.reject(new Error(getMessage(e as AuthError)))
		}
	}

	const signUp = (
		email: string,
		password: string,
		name: string
	): Promise<void> => {
		console.log('signUp', email, password, name)
		setUser({
			id: '1',
			lastSignIn: new Date(),
			name: 'John Doe',
			email: 'admin@example.com',
			phone: '555-555-5555',
		})
		return Promise.resolve()
	}

	const signOut = (): Promise<void> => {
		return fireSignOut(auth)
	}

	return { user, signIn, signUp, signOut }
}
