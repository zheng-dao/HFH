export default function Button(props) {
  return (
    <input
      type={props.inputType}
      value={props.inputValue}
      className={props.inputClass}
      onClick={props.inputOnClick}
      disabled={props.inputDisabled}
    />
  );
}

Button.defaultProps = {
  inputType: 'button',
  inputValue: '',
  inputClass: '',
  inputOnClick: () => {},
  inputDisabled: false,
};
