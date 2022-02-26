import { AuthError, AuthErrorCodes } from '@firebase/auth'

export enum ModelName {
	auth = 'auth',
	user = 'user',
}

export type FirebaseError = Record<string, string>

export const requiresReAuth = (e: AuthError): boolean =>
	e.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN

export const getMessage = (e: AuthError): string => {
	const message = ErrorMessages[e.code]
	return (
		message ?? e.message.replace('Firebase: ', '').replace(` (${e.code})`, '')
	)
}

export const ErrorMessages: FirebaseError = {
	'auth/email-already-exists': 'An account already exists with this email.',
	'auth/requires-recent-login':
		'Recent login required. Please sign out then sign back in to perform this action',
	'auth/weak-password': 'This password is too weak',
	'auth/invalid-password': 'This password is invalid.',
	'auth/invalid-email': 'Email address is invalid',
	'auth/user-not-found': 'Account does not exist for this email address',
	'auth/wrong-password': 'Incorrect password',
	'auth/email-already-in-use': 'An account already exists with this email',
}
