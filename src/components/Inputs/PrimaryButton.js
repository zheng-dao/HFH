import Button from "./Button";

export default function PrimaryButton(props) {
    return (
        <Button {...props} />
    )
}

PrimaryButton.defaultProps = {
    inputClass: "btn-primary"
}