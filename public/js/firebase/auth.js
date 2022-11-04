currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
    if(user != null)
        console.log("user: " + user.uid);
    else
        console.log("user: " + user);
});

function loginWithEmailAndPassword() {
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
      window.location.href = "../index.html";
    }).catch(error => {
        alert(getErrorMessage(error));
    });
  }  

function registerWithEmailAndPassword() {
    firebase.auth().createUserWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
      window.location.href = "../index.html";
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}

function signOut() {
    firebase.auth().signOut().then(response => {
    // console.log("SignOut");
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}

// Form object
const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
  } 