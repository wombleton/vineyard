import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import * as firebase from 'firebase'

import 'firebase/auth'

const rrfConfig = {
  userProfile: 'users'
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

firebase.initializeApp({
  apiKey: 'AIzaSyC3371CDS2M8mLvyBgzaKx2RasoYiFo0OA',
  authDomain: 'vineyard-7a909.firebaseapp.com',
  databaseURL: 'https://vineyard-7a909.firebaseio.com',
  projectId: 'vineyard-7a909',
  storageBucket: 'vineyard-7a909.appspot.com',
  messagingSenderId: '659902301954'
})
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig) // firebase instance as first argument
)(createStore)

const rootReducer = combineReducers({
  firebase: firebaseReducer
})

// Create store with reducers and initial state
const initialState = {}
const store = createStoreWithFirebase(rootReducer, initialState)

if (!firebase.auth().currentUser) {
  firebase.auth().signInAnonymously()
}

export { store as default }
