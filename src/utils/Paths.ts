export const Paths = {
	home: '/',
	server: '/channel/:serverId/',
	getServerPath: (serverId: number): string => `/channel/${serverId}`,
	channel: '/channel/:serverId/:channelId',
	getChannelPath: (serverId: number, channelId: number): string =>
		`/channel/${serverId}/${channelId}`,
	account: '/account',
	signin: '/signin',
	createAccount: '/create-account',
}
