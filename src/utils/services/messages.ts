import {
	addDoc,
	collection,
	onSnapshot,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore'
import { auth } from './auth'
import { database } from './firebase'
import { Message } from './models'

export const watchMessages = (
	channelId: string,
	setMessages: (messages: Message[]) => void
): (() => void) => {
	const unsubscribe = onSnapshot(
		query(
			collection(database, 'messages'),
			where('channelId', '==', channelId)
		),
		querySnapshot => {
			const messages: Message[] = []
			querySnapshot.forEach(doc => {
				messages.push({
					...(doc.data() as Omit<Message, 'id'>),
					id: doc.id,
					timestamp: doc.data().timestamp?.toDate() || null,
				})
			})
			setMessages(messages)
		}
	)

	return unsubscribe
}

export const sendMessage = (
	channelId: string,
	content: string
): Promise<void> => {
	return new Promise(reject => {
		if (!auth.currentUser) return reject()

		return addDoc(collection(database, 'messages'), {
			userId: auth.currentUser.uid,
			channelId,
			content,
			timestamp: serverTimestamp(),
		})
	})
}
