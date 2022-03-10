import { collection, query, where, onSnapshot } from 'firebase/firestore'
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
