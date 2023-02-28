import Textfield from "./Textfield"

export default function Emailfield(props) {
    return (
        <Textfield {...props} />
    )
}

Emailfield.defaultProps = {
    inputType: "email"
}