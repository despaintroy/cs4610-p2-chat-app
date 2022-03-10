import {
	collection,
	query,
	where,
	onSnapshot,
	addDoc,
} from 'firebase/firestore'
import { auth } from './auth'
import { database } from './firebase'
import { Channel } from './models'

export const watchChannels = (
	serverIds: string[],
	setChannels: (channels: Channel[]) => void
): (() => void) => {
	if (serverIds.length === 0) {
		setChannels([])
		return (): void => {
			return
		}
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

export const createChannel = (
	serverId: string,
	name: string
): Promise<void> => {
	if (!auth.currentUser) return Promise.reject()

	return addDoc(collection(database, 'channels'), { name, serverId }).then(
		() => {
			return
		}
	)
}
