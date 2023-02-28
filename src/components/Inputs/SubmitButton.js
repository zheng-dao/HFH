import PrimaryButton from "./PrimaryButton";

export default function SubmitButton(props) {
    return (
        <PrimaryButton {...props} />
    )
}

SubmitButton.defaultProps = {
    inputType: "submit"
}