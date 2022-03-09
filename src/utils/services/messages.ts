import {
	collection,
	query,
	where,
	onSnapshot,
	serverTimestamp,
	addDoc,
} from 'firebase/firestore'
import { auth } from './auth'
import { database } from './firebase'
import { Message } from './models'

export const watchMessages = (
	channelIds: string[],
	setMessages: (messages: Message[]) => void
): (() => void) => {
	if (channelIds.length === 0) {
		setMessages([])
		return (): void => {
			return
		}
	}

	const q = query(
		collection(database, 'messages'),
		where('channelId', 'in', channelIds)
	)

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const messages: Message[] = []
		querySnapshot.forEach(doc => {
			messages.push({
				...(doc.data() as Omit<Message, 'id'>),
				id: doc.id,
				timestamp: doc.data().timestamp?.toDate() || null,
			})
		})
		setMessages(messages)
	})

	return unsubscribe
}

export const sendMessage = (
	channelId: string,
	content: string
): Promise<void> => {
	return new Promise((reject) => {
		if (!auth.currentUser) return reject()

		return addDoc(collection(database, 'messages'), {
			userId: auth.currentUser.uid,
			channelId,
			content,
			timestamp: serverTimestamp(),
		})
	})
}
