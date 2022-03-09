import { collection, query, where, onSnapshot } from 'firebase/firestore'
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
				timestamp: doc.data().timestamp.toDate(),
			})
		})
		setMessages(messages)
	})

	return unsubscribe
}
