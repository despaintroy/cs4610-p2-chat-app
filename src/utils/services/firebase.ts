import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// These keys are safe to expose
const firebaseConfig = {
	apiKey: 'AIzaSyCae9BWEbHLP_-lwvRfThwzhR0cL0UFho0',
	authDomain: 'cs4610-chat-app.firebaseapp.com',
	projectId: 'cs4610-chat-app',
	storageBucket: 'cs4610-chat-app.appspot.com',
	messagingSenderId: '195643145180',
	appId: '1:195643145180:web:9bb93b682a75b9f4fbed19',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const database = getFirestore()
