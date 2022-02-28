import { Message, Server, User, Channel } from './models'

const ipsum =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget massa lobortis libero dapibus facilisis. Phasellus lacus urna, aliquet vitae nulla ut, lacinia eleifend nisi. Quisque ut aliquet mi. Nam consequat elit vitae vehicula mattis. In vitae egestas turpis. Sed in eros condimentum, congue tellus in, auctor tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In ultricies turpis non sem auctor, in dapibus nisl vehicula. Integer lectus diam, tincidunt sit amet elit vitae, pretium feugiat turpis. Praesent libero velit, egestas nec velit at, posuere pharetra augue. Suspendisse sit amet sagittis nisi.'

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

export const messages: Omit<Message, 'content'>[] = [
	{
		id: '0',
		userId: users[0].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
	},
	{
		id: '1',
		userId: users[1].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
	},
	{
		id: '2',
		userId: users[2].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
	},
	{
		id: '3',
		userId: users[3].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
	},
	{
		id: '4',
		userId: users[4].id,
		timestamp: new Date(Date.now() - Math.random() * 100000),
	},
]

const channelNames = ['General', 'Random', 'Friends', 'Work', 'Games']
export const channels: Channel[] = channelNames.map((name, index) => ({
	id: index.toString(),
	name,
	messages: messages.map(message => {
		const content = ipsum.substring(
			Math.floor(Math.random() * ipsum.length),
			Math.floor(Math.random() * ipsum.length)
		)
		return {
			...message,
			content,
		}
	}),
}))

const serverNames = ['HackUSU Club', 'CS-4610 Chat', 'Friends']
export const servers: Server[] = serverNames.map((name, index) => ({
	id: index.toString(),
	name,
	channels,
	userProfiles: users.map((user, index) => ({
		userId: user.id,
		name: user.name,
		profileImage: `${process.env.PUBLIC_URL}/identicons/${index + 1}.png`,
	})),
}))
