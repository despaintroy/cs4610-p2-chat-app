import { Message, Server, User, Channel } from './models'

const userNames = [
	'John',
	'Jane',
	'Bob',
	'Alice',
	'Sam',
	'Sally',
	'Sue',
	'Mike',
	'Nancy',
]
export const users: User[] = userNames.map((name, index) => ({
	id: index.toString(),
	name,
}))

export const messages: Message[] = [
	{
		id: '0',
		userId: users[0].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'Hello, world!',
	},
	{
		id: '1',
		userId: users[1].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'My name is Jane!',
	},
	{
		id: '2',
		userId: users[2].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'What is your name?',
	},
	{
		id: '3',
		userId: users[3].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'I like cheese pizza!',
	},
	{
		id: '4',
		userId: users[4].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'React is cool!',
	},
]

const channelNames = ['General', 'Random', 'Friends', 'Work', 'Games']
export const channels: Channel[] = channelNames.map((name, index) => ({
	id: index.toString(),
	name,
	messages,
}))

const serverNames = ['HackUSU Club', 'CS-4610 Chat', 'Friends']
export const servers: Server[] = serverNames.map((name, index) => ({
	id: index.toString(),
	name,
	channels,
	userProfiles: users.map(user => ({
		userId: user.id,
		name: user.name,
	})),
}))
