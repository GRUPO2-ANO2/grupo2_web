currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
	currentUser = user;
	if (user != null) {
		console.log("user: " + user.uid);

		if (window.location.pathname.split("/").pop() == "edit.html") {
			showProfile()
		}
	} else
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
		console.log("Account Created");
		window.location.href = "../pages/infoPessoais.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

async function registerPersonalInformations() {
	firebase.firestore().collection("utilizadores").doc(currentUser.uid).set({
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

async function userIsGuia() {
	var userDoc = await firebase.firestore().collection("utilizadores").doc(currentUser.uid);

	// open doc
	return userDoc.get().then((doc) => {
		if (doc.exists) {
			return doc.data().isGuia;
		} else {
			console.log("No collection for user registered");
		}
	}).catch((error) => {
		console.log("Error getting document:", error);
	});
}

function updateUserProfile() {
	currentUser.updateProfile({
		displayName: form.name().value,
		email: form.email().value,
		password: form.password().value
	}).then(response => {
		window.location.href = "../index.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

function updateEmail() {
	firebase.auth().updateEmail(currentUser, form.email().value).then(() => {
		console.log("Email Updated")
	}).catch(error => {
		alert(getErrorMessage(error));
	})
}

async function showProfile() {
	var userData = await firebase.firestore().collection("utilizadores").doc(currentUser.uid);

	document.getElementById("userData").innerHTML = currentUser.displayName;
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