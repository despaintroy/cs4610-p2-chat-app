export const Paths = {
	home: '/',
	server: '/channel/:serverId/',
	getServerPath: (serverId: string): string => `/channel/${serverId}`,
	channel: '/channel/:serverId/:channelId',
	getChannelPath: (serverId: string, channelId: string): string =>
		`/channel/${serverId}/${channelId}`,
	nearby: '/nearby',
	account: '/account',
	signin: '/signin',
	createAccount: '/create-account',
}
