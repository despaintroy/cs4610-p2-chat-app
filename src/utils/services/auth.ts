import { useState } from 'react'
import { User } from './models'

export interface AuthContextType {
	user: User | null | undefined
	signIn: (email: string, password: string) => Promise<void>
	signUp: (email: string, password: string, name: string) => Promise<void>
	signOut: () => Promise<void>
}

export const useAuth = (): AuthContextType => {
	const [user, setUser] = useState<User | null | undefined>(null)

	const signIn = async (email: string, password: string): Promise<void> => {
		console.log('signIn', email, password)
		setUser({
			id: '1',
			lastSignIn: new Date(),
			name: 'John Doe',
			email: 'admin@example.com',
			phone: '555-555-5555',
		})
		return Promise.resolve()
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
		console.log('signOut')
		setUser(null)
		return Promise.resolve()
	}

	return { user, signIn, signUp, signOut }
}
