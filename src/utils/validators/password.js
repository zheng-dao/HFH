import passwordValidator from 'password-validator'

export default function validatePassword(password) {

    password = password.trim()
    const schema = new passwordValidator();

    schema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols()

    if (password.length == 0) {
        return {
            valid: false,
            message: "Password is required."
        }
    }
    else if (!schema.validate(password)) {
        return {
            valid: false,
            message: "Please enter a valid password at least 8 characters in length with uppercase and lowercase letters, at least 1 digit, and at least 1 symbol."
        }
    }

    return {
        valid: true,
        message: ""
    }
}