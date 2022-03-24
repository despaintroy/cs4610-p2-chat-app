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
	serverId: string,
	setChannels: (channels: Channel[]) => void
): (() => void) => {
	const unsubscribe = onSnapshot(
		query(collection(database, 'channels'), where('serverId', '==', serverId)),
		querySnapshot => {
			const channels: Channel[] = []
			querySnapshot.forEach(doc => {
				channels.push({ ...(doc.data() as Omit<Channel, 'id'>), id: doc.id })
			})
			setChannels(channels)
		}
	)

	return unsubscribe
}

export const createChannel = async (
	serverId: string,
	name: string
): Promise<string> => {
	if (!auth.currentUser) return Promise.reject()

	const ref = await addDoc(collection(database, 'channels'), { name, serverId })
	return ref.id
}

// export const deleteChannelByServerId = async (serverId: string): Promise<void> => {
// 	const q = query(collection(database, 'channels'), where('serverId', '==', serverId))

// 	const docs = await getDocs(q).then(snapshot => snapshot.docs)

// 	return Promise.all(docs.map(doc => doc.data().then(d => ))).then(() => Promise.resolve())
// }
