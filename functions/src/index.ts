import * as functions from 'firebase-functions'
import express = require('express')
import * as cors from 'cors'
import { Request, Response } from 'express'
import { initializeApp, credential, auth } from 'firebase-admin'

const app = express()

app.use(cors({ origin: true }))

initializeApp({
	credential: credential.applicationDefault(),
	// databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
})

app.post('/getUserProfiles', (req: Request, res: Response) => {

	const userIds = req.body.userIds as string[]

	return auth()
		.getUsers(userIds.map(uid => ({ uid })))
		.then(result => {
			return res.status(200).send(
				result.users.map(user => ({
					id: user.uid,
					name: user.displayName,
					profileImage: user.photoURL,
				}))
			)
		})
})

exports.app = functions.https.onRequest(app)
