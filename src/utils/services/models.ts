export interface User {
	id: string
	lastSignIn?: Date
	name?: string | null
	email?: string | null
	phone?: string | null
}

export interface Message {
	id: string
	user: User
	timestamp: Date
	content: string
}
export interface Channel {
	id: string
	name: string
}

export interface Server {
	id: string
	name: string
	channels: Channel[]
	users: User[]
}
