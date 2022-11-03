function register() {
    firebase.auth().createUserWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
      window.location.href = "../index.html";
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}