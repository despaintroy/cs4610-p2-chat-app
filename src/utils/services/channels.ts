import { collection, query, where, onSnapshot } from 'firebase/firestore'
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
