currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
	currentUser = user;

	const loginLink = document.querySelector('.login-link');
	const registerLink = document.querySelector('.register-link');
	const profileLink = document.querySelector('.profile-link');

	if (user != null) {
		console.log("user: " + user.uid);

		// change navbar if user is loggedin
		loginLink.style.display = 'none';
		registerLink.style.display = 'none';
		profileLink.style.display = 'block';

		switch (window.location.pathname.split("/").pop()) {
			case "edit.hmtl":
				showProfile();
				break;

			case "profile.html":
				showPersonalInformation();
				break;
		}
	} else {
		console.log("user: " + user);

		loginLink.style.display = 'block';
		registerLink.style.display = 'block';
		profileLink.style.display = 'none';
	}


});

async function loginWithEmailAndPassword() {
	await firebase.auth().signInWithEmailAndPassword(
		form.email().value, form.password().value
	).then(response => {
		window.location.href = "../index.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

async function registerWithEmailAndPassword() {
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
async function registerPersonalInformations() {

	let birthDate = new Date(form.birthDate().value);
	let contact = parseInt(form.contact().value);
	let height = parseFloat(form.height().value);
	let weight = parseFloat(form.weight().value);

	await firebase.firestore().collection("utilizadores").doc(currentUser.uid).set({
		isGuia: 0,
		Name: form.name().value,
		Contact: contact,
		BirthDate: birthDate,
		Height: height,
		Weight: weight
	}).then(() => {
		console.log("Personal Informations Added");
		window.location.href = "../index.html";
	}).catch(error => {
		alert(getErrorMessage(error));
	});
}

async function editPersonalInformations() {

	let birthDate = new Date(form.birthDate().value);
	let contact = parseInt(form.contact().value);
	let height = parseFloat(form.height().value);
	let weight = parseFloat(form.weight().value);

	const docRef = await firebase.firestore().collection("utilizadores").doc(currentUser.uid);

	docRef.update({
		isGuia: 0,
		Name: form.name().value,
		Contact: contact,
		BirthDate: birthDate,
		Height: height,
		Weight: weight
	})
}

async function showPersonalInformation() {

	await firebase.firestore().collection("utilizadores").doc(currentUser.uid).get().then(async function(doc) {
		if (doc.exists) {
			const data = doc.data();

			document.getElementById("name").value = data.Name;
			const timestamp = data.BirthDate
			const timestampAsDate = timestamp.toDate();

			const options = {
				day: "2-digit",
				month: "2-digit",
				year: "numeric"
			};
			const timestampAsString = timestampAsDate.toLocaleDateString("pt-PT", options);

			const formattedDate = timestampAsString
				.split("/")
				.reverse()
				.join("-");
			document.getElementById("birthDate").value = formattedDate;

			document.getElementById("height").value = data.Height;
			document.getElementById("weight").value = data.Weight;
			document.getElementById("contact").value = data.Contact;
		}
	});
}

// This fn should be in user.js
async function updateUserProfile() {
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

async function updateEmail() {
	await firebase.auth().updateEmail(currentUser, form.email().value).then(() => {
		console.log("Email Updated");
	}).catch(error => {
		alert(getErrorMessage(error));
	})
}

async function showProfile() {
	var userData = await getUserData();

	document.getElementById("userData").innerHTML = currentUser.displayName;
}

async function signOut() {
	await firebase.auth().signOut().then(response => {
		if (window.location.pathname.split("/").pop() == "index.html") {
			window.location.href = "index.html";
		} else {
			window.location.href = "../index.html";
		}
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