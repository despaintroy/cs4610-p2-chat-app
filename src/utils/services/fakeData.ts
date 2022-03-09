import { User } from './models'

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
