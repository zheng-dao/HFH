export default function valueOrEmptyString(input) {
    if (input == null || input == undefined) {
        return ""
    }

    return input
}