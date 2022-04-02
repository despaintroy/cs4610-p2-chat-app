export interface User {
	id: string
	lastSignIn?: Date
	name?: string | null
	email?: string | null
	phone?: string | null
	picture?: string | null
}

export interface PublicProfile {
	id: string
	name?: string | null
	profileImage?: string | null
}

export interface Message {
	id: string
	channelId: string
	userId: string
	timestamp: Date | null
	content: string
}
export interface Channel {
	id: string
	serverId: string
	name: string
}
export interface LocalChannel {
	id: string
	name: string
	location: {
		lat: number
		lon: number
	}
}

export interface Server {
	id: string
	name: string
	update: number
	users: string[]
}
