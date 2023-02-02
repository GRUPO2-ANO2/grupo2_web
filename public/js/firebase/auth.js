currentUser = null;

firebase.auth().onAuthStateChanged(async (user) => {
	currentUser = user;

	const loginLink = document.querySelector('.login-link');
	const registerLink = document.querySelector('.register-link');
	const profileLink = document.querySelector('.profile-link');
	const adminLink = document.querySelector('.admin-link');
	const eventLink = document.querySelector('.event-link');

	const location = window.location.pathname.split("/").pop();

	if(window.location.pathname.split("/").pop() != "admin.html") {
		adminLink.style.display = 'none';
		registerLink.style.display = 'none';
		loginLink.style.display = 'none';
		eventLink.style.display = 'none';
		profileLink.style.display = 'none';
	}

	if (user != null) {
		console.log("user: " + user.uid);
		const isGuia = await userIsGuia();

		if(window.location.pathname.split("/").pop() != "admin.html") {
			// change navbar if user is loggedin
			profileLink.style.display = 'block';
			eventLink.style.display = 'block';
		
			if (isGuia) {
				adminLink.style.display = 'block'
			}

		}

		switch (window.location.pathname.split("/").pop()) {
			case "edit.hmtl":
				showProfile();
				break;

			case "profile.html":
				showPersonalInformation();
				showEventsByUser();
				break;

			case "admin.html":
				showEventsByGuia();
				generateEventRows();
				renderEvent();
				break;
				
			case "evento.html":
				eventLink.style.display = 'none';
		}
	} else {
		console.log("user: " + user);

		loginLink.style.display = 'block';
		registerLink.style.display = 'block';
		eventLink.style.display = 'block';

		switch (window.location.pathname.split("/").pop()) {
			case "evento.html":
				eventLink.style.display = 'none';
		}
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
	eventName: () => document.getElementById("eventName"),
	startDate: () => document.getElementById("startDate"),
	finishDate: () => document.getElementById("endDate"),
	registrations: () => document.getElementById("registrations"),
	eventId: () => document.getElementById("eventId"),
	dem: () => document.getElementById("dem"),
	elevation: () => document.getElementById("elevation"),
	latitude: () => document.getElementById("latitude"),
	longitude: () => document.getElementById("longitude"),
}