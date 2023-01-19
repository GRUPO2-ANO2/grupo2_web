/*
 REQUIRES constants.js FILE IMPORTED
*/

function getErrorMessage(error) {
	errorMsg = error.message;

	switch (error.code) {
		case "auth/email-already-in-use":
			errorMsg = "Email já em uso.";
			break;
		case "auth/user-not-found":
			errorMsg = "Utilizador não encontrado";
			break;
		case "auth/invalid-email":
			showError("Email inválido.");
			break;
		case "auth/weak-password":
			errorMsg = "Password fraca(deve ser de 6 ou mais caracteres).";
			break;
		case "auth/wrong-password":
			errorMsg = "Password errada.";
			break;
		case "auth/requires-recent-login":
			errorMsg = "Mudança de password requer um login recente, faça login.";
			break;
		case "auth/weak-password":
			errorMsg = "Password Fraca.";
			break;
	}

	return errorMsg;
}

function showError(message) {

	const element = document.getElementById('msg');

	const alert = document.createElement('div');
	alert.className = `alert alert-warning alert-dismissible fade show`;
	alert.innerHTML = `
	<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:">
		<use xlink:href="#exclamation-triangle-fill"/>
	</svg>
	<strong>Aviso</strong> ${message}.
  	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	`;

	element.appendChild(alert);
}

function isEmailValid(email) {
	// const email = form.email().value;
	return (!email) ? false : validateEmail(email);
}

function isPasswordValid(password) {
	// return form.password().value ? true : false;
	return (password.length > PASSWORD_MIN_LENGTH) ? true : false;
}

function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

function onChangeEmail() {
	// TODO
	return;
}

function onChangeEmail() {
	// TODO
	return;
}

function onChangePassword() {
	// TODO
	return;
}

function toggleEmailErrors() {
	// TODO
	return;
}

function togglePasswordErrors() {
	// TODO
	return;
}