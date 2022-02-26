export const Paths = {
	home: '/',
	channel: '/channel/:serverId/:channelId',
	getChannelPath: (serverId: number, channelId: number): string =>
		`/channel/${serverId}/${channelId}`,
	account: '/account',
	signin: '/signin',
	createAccount: '/create-account',
}
