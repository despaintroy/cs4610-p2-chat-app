import {
	addDoc,
	arrayRemove,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
import { auth } from './auth'
import { createChannel } from './channels'
import { database } from './firebase'
import { Server } from './models'

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

export const leaveServer = (serverId: string): Promise<void> => {
	const userId = auth.currentUser?.uid
	if (!userId) return Promise.reject()

	const serverRef = doc(database, 'servers', serverId)
	return updateDoc(serverRef, { users: arrayRemove(userId) })
}

export const createServer = async (serverName: string): Promise<string> => {
	if (!auth.currentUser) return Promise.reject()

	const ref = await addDoc(collection(database, 'servers'), {
		name: serverName,
		users: [auth.currentUser.uid],
		update: 0,
	})

	// Add initial channel to server
	createChannel(ref.id, 'general')

	return ref.id
}

export const deleteServer = (serverId: string): Promise<void> => {
	return deleteDoc(doc(database, 'servers', serverId))
}

export const updateServerName = (
	serverId: string,
	name: string
): Promise<void> => {
	const userId = auth.currentUser?.uid
	if (!userId) return Promise.reject()

	const serverRef = doc(database, 'servers', serverId)
	return updateDoc(serverRef, { name })
}
