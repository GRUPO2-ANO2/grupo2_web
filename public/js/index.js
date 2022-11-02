import { initializeApp } from 'firebase/app';

import { 
  hideLoginError, 
  showLoginState, 
  showLoginForm, 
  showApp, 
  showLoginError, 
  btnLogin,
  btnSignup,
  btnLogout
} from './ui';

import { 
  getAuth,
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

// Web app's Firebase configuration
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCTx1Z-1z6x6cG4SrBsf7nWb5sUimfF1wg",
  authDomain: "grupo2-6980f.firebaseapp.com",
  databaseURL: "https://grupo2-6980f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "grupo2-6980f",
  storageBucket: "grupo2-6980f.appspot.com",
  messagingSenderId: "320559211112",
  appId: "1:320559211112:web:32eb3d060a84d01bca91dd",
  measurementId: "G-8184SBYGFP"
})
 
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

//#region auth
// Login using email/password
const loginEmailPassword = async () => {
  console.log("debug")
  const loginEmail = txtEmail.value
  const loginPassword = txtPassword.value

  await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
}
  
// Create new account using email/password
const createAccount = async () => {
  const email = txtEmail.value
  const password = txtPassword.value

  try {
    await createUserWithEmailAndPassword(auth, email, password)
  }
  catch(error) {
    console.log(`There was an error: ${error}`)
    showLoginError(error)
  } 
}

// Monitor auth state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user)
      showApp()
      showLoginState(user)

      hideLoginError()
      hideLinkError()
    }
    else {
      showLoginForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}

// Log out
const logout = async () => {
  await signOut(auth);
}

btnLogin.addEventListener("click", loginEmailPassword) 
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

const auth = getAuth(firebaseApp);

monitorAuthState();
//#endregion