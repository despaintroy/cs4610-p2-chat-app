import {
	updateEmail as updateFireEmail,
	updatePassword as updateFirePassword,
	updateProfile,
	User as FireUser,
} from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth } from './auth'
import { User } from './models'
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

export const updateProfilePicture = (profilePicture: File): Promise<string> =>
	auth.currentUser
		? uploadBytes(
				ref(storage, `${auth.currentUser.uid}/profile-picture`),
				profilePicture
			).then(snapshot => getDownloadURL(snapshot.ref))
		: Promise.reject()
