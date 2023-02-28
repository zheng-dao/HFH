import Textfield from "./Textfield"

export default function Passwordfield(props) {
    return (
        <Textfield {...props} />
    )
}

Passwordfield.defaultProps = {
    inputType: "password",
}