// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDqU66BCUh4MQgQWkb3fCe0cUWEbBz_79c',
  authDomain: 'id1212-project-1991d.firebaseapp.com',
  projectId: 'id1212-project-1991d',
  storageBucket: 'id1212-project-1991d.appspot.com',
  messagingSenderId: '891396975989',
  appId: '1:891396975989:web:fc70e00ac1d2f738e4373c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
