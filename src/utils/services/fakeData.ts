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
		user: users[0],
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'Hello, world!',
	},
	{
		id: '1',
		user: users[1],
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'My name is Jane!',
	},
	{
		id: '2',
		user: users[2],
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'What is your name?',
	},
	{
		id: '3',
		user: users[3],
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'I like cheese pizza!',
	},
	{
		id: '4',
		user: users[4],
		timestamp: new Date(Date.now() - Math.random() * 100000),
		content: 'React is cool!',
	},
]

const channelNames = ['General', 'Random', 'Friends', 'Work', 'Games']
export const channels: Channel[] = channelNames.map((name, index) => ({
	id: index.toString(),
	name,
}))

const serverNames = ['HackUSU Club', 'CS-4610 Chat', 'Friends']
export const servers: Server[] = serverNames.map((name, index) => ({
	id: index.toString(),
	name,
	channels,
	users,
}))
