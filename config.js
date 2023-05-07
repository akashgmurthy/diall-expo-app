import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCabJYVDgS6pGjws4RZxgj_E8V21HvMcyw",
  authDomain: "diall-app-33f6e.firebaseapp.com",
  projectId: "diall-app-33f6e",
  storageBucket: "diall-app-33f6e.appspot.com",
  messagingSenderId: "937793359525",
  appId: "1:937793359525:web:46b276840df925dfab874c"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export { firebase };