import { firebaseApp } from './firebase'
import { getStorage } from 'firebase/storage'

export const storage = getStorage(firebaseApp)
