export interface User {
	id: string
	lastSignIn?: Date
	name?: string | null
	email?: string | null
	phone?: string | null
}

export interface Server {
	id: number
	name: string
}
