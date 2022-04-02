import {
	addDoc,
	collection,
	doc,
	GeoPoint,
	getDoc,
	getDocs,
	onSnapshot,
} from 'firebase/firestore'
import { auth } from './auth'
import { database } from './firebase'
import { LocalChannel } from './models'

export const watchLocalChannel = (
	localChannelId: string,
	setChannel: (channel: LocalChannel) => void
): (() => void) => {
	const unsubscribe = onSnapshot(
		doc(database, 'localChannels', localChannelId),
		docSnapshot => {
			setChannel(docSnapshot.data() as LocalChannel)
		}
	)

	return unsubscribe
}

export const createLocalChannel = async (
	name: string,
	location: {
		lat: number
		lon: number
	}
): Promise<string> => {
	if (!auth.currentUser) return Promise.reject()

	const ref = await addDoc(collection(database, 'localChannels'), {
		name,
		location: new GeoPoint(location.lat, location.lon),
	})
	return ref.id
}

export const getLocalChannels = async (): Promise<LocalChannel[]> => {
	const localChannels: LocalChannel[] = []

	const querySnapshot = await getDocs(collection(database, 'localChannels'))
	querySnapshot.forEach(doc => {
		const data = doc.data()
		localChannels.push({
			id: doc.id,
			name: data.name,
			location: {
				lat: data.location.latitude,
				lon: data.location.longitude,
			},
		})
	})

	return localChannels
}

export const getLocalChannelById = async (
	id: string
): Promise<LocalChannel> => {
	const docRef = doc(database, 'localChannels', id)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		const data = docSnap.data()
		return {
			id: data.id,
			name: data.name,
			location: {
				lat: data.location.latitude,
				lon: data.location.longitude,
			},
		}
	} else {
		return Promise.reject()
	}
}
