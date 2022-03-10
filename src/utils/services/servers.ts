import {
	collection,
	query,
	where,
	onSnapshot,
	doc,
	updateDoc,
	arrayRemove,
} from 'firebase/firestore'
import { auth } from './auth'
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
