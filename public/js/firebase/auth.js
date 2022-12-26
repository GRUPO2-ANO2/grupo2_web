currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
	currentUser = user;
	if (user != null){
		console.log("user: " + user.uid);

		if (window.location.pathname.split("/").pop() == "edit.html") {
			showProfile();
		}
	} else{
		console.log("user: " + user);
	}
});

async function loginWithEmailAndPassword(){
	await firebase.auth().signInWithEmailAndPassword(
		form.email().value, form.password().value
	).then(response => {
		window.location.href = "../index.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

async function registerWithEmailAndPassword(){
	await firebase.auth().createUserWithEmailAndPassword(
		form.email().value, form.password().value
	).then(response => {
		console.log("Account Created");
		window.location.href = "../pages/infoPessoais.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

// This fn should be in user.js
async function registerPersonalInformations(){
	await firebase.firestore().collection("utilizadores").doc(currentUser.uid).set({
		isGuia: 0,
		Name: form.name().value,
		Contact: form.contact().value,
		BirthDate: form.birthDate().value,
		Height: form.height().value,
		Weight: form.weight().value
	}).then(() => {
		console.log("Personal Informations Added");
		window.location.href = "../index.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

// This fn should be in user.js
async function updateUserProfile(){
	await currentUser.updateProfile({
		displayName: form.name().value,
		email: form.email().value,
		password: form.password().value
	}).then(response => {
		window.location.href = "../index.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

async function updateEmail(){
	await firebase.auth().updateEmail(currentUser, form.email().value).then(() => {
		console.log("Email Updated");
	}).catch(error => {
		alert(getErrorMessage(error));
	})
}

async function showProfile(){
	var userData = await getUserData();

	document.getElementById("userData").innerHTML = currentUser.displayName;
}

async function signOut(){
	await firebase.auth().signOut().then(response => {
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

// Form object
const form = {
	email: () => document.getElementById("email"),
	password: () => document.getElementById("password"),
	name: () => document.getElementById("name"),
	birthDate: () => document.getElementById("birthDate"),
	height: () => document.getElementById("height"),
	weight: () => document.getElementById("weight"),
	contact: () => document.getElementById("contact"),
	emailInvalidError: () => document.getElementById("email-invalid-error"),
	emailRequiredError: () => document.getElementById("email-required-error"),
	loginButton: () => document.getElementById("login-button"),
	passwordRequiredError: () => document.getElementById("password-required-error"),
	recoverPasswordButton: () => document.getElementById("recover-password-button"),
}