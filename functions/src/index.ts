import 'firebase-functions'

import * as cors from 'cors'
import express = require('express')
import { Request, Response } from 'express'
import * as functions from 'firebase-functions'

const app = express()

app.use(cors({ origin: true }))

app.get('/api/server-invite/create', (req: Request, res: Response) => {
	res.status(501).send('Endpoint not implemented')
})

app.get('/api/server-invite/join', (req: Request, res: Response) => {
	res.status(501).send('Endpoint not implemented')
})

exports.app = functions.https.onRequest(app)
