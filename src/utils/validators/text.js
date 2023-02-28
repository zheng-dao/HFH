export default function validateText(value) {

    value = value.trim()

    if (value.length == 0) {
        return {
            valid: false,
            message: "Field is required."
        }
    }
    else if (value.toUpperCase() == value.toLowerCase()) {
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