export interface User {
	id: string
	lastSignIn?: Date
	name?: string | null
	email?: string | null
	phone?: string | null
}

export interface PublicProfile {
	userId: string
	name?: string | null
	profileImage?: string | null
}

export interface Message {
	id: string
	channelId: string
	userId: string
	timestamp: Date
	content: string
}
export interface Channel {
	id: string
	serverId: string
	name: string
	messages?: Message[]
}

export interface Server {
	id: string
	name: string
	channels?: Channel[]
	userProfiles?: PublicProfile[]
}
