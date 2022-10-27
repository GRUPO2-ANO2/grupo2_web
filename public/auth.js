import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Get initialized firebaseApp
// const firebaseApp = require('./index');

const auth = getAuth();

// Returns user if sucessful
function login(email, password){
    var user = null;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            user = userCredential.user;
        })
        .catch((error) => {
            console.log(error);
        });

      return user;
}

// Returns user if sucessful
function register(email, password){
    var user = null;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Account Created
            user = userCredential.user;
        })
        .catch((error) => {
            console.log(error);
        });

    return user;
}

// Sync buttons and functions
let btnLogin = document.getElementById("button_login");
let textEmailLogin = document.getElementById("text_login_email").textContent;
let textPasswordLogin = document.getElementById("text_login_password").textContent;

btnLogin.addEventListener('click', login(textEmailLogin, textPasswordLogin));