import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { database } from './firebase'
import { Channel, Message, Server } from './models'

const emptyFunction = (): void => {
	return
}

export const watchServers = (
	userId: string,
	setServers: (servers: Server[]) => void
): (() => void) => {
	const q = query(
		collection(database, 'servers'),
		where('users', 'array-contains', userId)
	)

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const servers: Server[] = []
		querySnapshot.forEach(doc => {
			servers.push({ ...(doc.data() as Omit<Server, 'id'>), id: doc.id })
		})
		setServers(servers)
	})

	return unsubscribe
}

export const watchChannels = (
	serverIds: string[],
	setChannels: (channels: Channel[]) => void
): (() => void) => {
	if (serverIds.length === 0) {
		setChannels([])
		return emptyFunction
	}

	const q = query(
		collection(database, 'channels'),
		where('serverId', 'in', serverIds)
	)

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const channels: Channel[] = []
		querySnapshot.forEach(doc => {
			channels.push({ ...(doc.data() as Omit<Channel, 'id'>), id: doc.id })
		})
		setChannels(channels)
	})

	return unsubscribe
}

export const watchMessages = (
	channelIds: string[],
	setMessages: (messages: Message[]) => void
): (() => void) => {
	if (channelIds.length === 0) {
		setMessages([])
		return emptyFunction
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
