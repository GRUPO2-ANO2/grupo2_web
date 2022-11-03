// import { PASSWORD_MIN_LENGTH } from "../constants";

function isEmailValid(email) {
    // const email = form.email().value;
    return (!email)? false : validateEmail(email);
}

function isPasswordValid(password) {
    // return form.password().value ? true : false;
    return (password.length > PASSWORD_MIN_LENGTH)? true : false;
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}