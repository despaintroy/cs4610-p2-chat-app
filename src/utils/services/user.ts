import {
	updateEmail as updateFireEmail,
	updatePassword as updateFirePassword,
	updateProfile,
	User as FireUser,
} from 'firebase/auth'
import { auth } from './auth'
import { PublicProfile, User } from './models'

export const formatUser = (user: FireUser | null): User | null => {
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

export const updateName = (name: string): Promise<void> =>
	auth.currentUser
		? updateProfile(auth.currentUser, { displayName: name })
		: Promise.reject()

export const updateEmail = (email: string): Promise<void> =>
	auth.currentUser ? updateFireEmail(auth.currentUser, email) : Promise.reject()

export const updatePassword = (password: string): Promise<void> =>
	auth.currentUser
		? updateFirePassword(auth.currentUser, password)
		: Promise.reject()

export const getUserProfiles = async (
	userIds: string[]
): Promise<PublicProfile[]> => {
	const res = await fetch(
		'https://us-central1-cs4610-chat-app.cloudfunctions.net/app/getUserProfiles',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userIds }),
		}
	)
	const data = await res.json()
	console.log(data)
	return data
}
