function getErrorMessage(error) {
    errorMsg = error.message;

    switch(error.code){
        case "auth/email-already-in-use":
            errorMsg = "Email já em uso.";
            break;
        case "auth/user-not-found":
            errorMsg = "Utilizador não encontrado";
            break;
        case "auth/invalid-email":
            errorMsg = "Email inválido.";
            break;
        case "auth/weak-password":
            errorMsg = "Password fraca(deve ser de 6 ou mais caracteres).";
            break;
        case "auth/wrong-password":
            errorMsg = "Password errada.";
            break;
    }

    return errorMsg;
}

function signOut() {
    firebase.auth().signOut().then(response => {
    // console.log("SignOut");
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}