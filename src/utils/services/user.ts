import {
	updateEmail as updateFireEmail,
	updatePassword as updateFirePassword,
	updateProfile,
	User as FireUser,
} from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth } from './auth'
import { PublicProfile, User } from './models'
import { storage } from './storage'

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
			picture: user.photoURL,
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

export const updateProfilePicture = async (
	profilePicture: File
): Promise<string> => {
	const user = auth.currentUser
	if (!user) return Promise.reject()

	const snapshot = await uploadBytes(
		ref(storage, `${user.uid}/${profilePicture.name}`),
		profilePicture
	)
	const url = await getDownloadURL(snapshot.ref)
	await updateProfile(user, { photoURL: url })
	return url
}

export const getUserProfiles = async (
	userIds: string[]
): Promise<PublicProfile[]> => {
	const res = await fetch(
		'https://us-central1-cs4610-chat-app.cloudfunctions.net/app/getUserProfiles',
		// 'http://localhost:5001/cs4610-chat-app/us-central1/app/getUserProfiles',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userIds }),
		}
	)
	const data = await res.json()
	return data
}
