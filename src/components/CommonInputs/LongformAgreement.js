import Checkboxfield from '@components/Inputs/Checkboxfield';

export default function LongformAgreement(props) {
  return (
    <div className="alert-pane">
      <h3>{props.title}</h3>

      <p dangerouslySetInnerHTML={{ __html: props.intro }}></p>

      <p>
        <Checkboxfield
          label={props.inputValue}
          inputChecked={props.inputChecked}
          inputOnChange={props.inputOnChange}
          isValid={props.isValid}
          errorMessage={props.errorMessage}
          inputDisabled={props.disabled}
        />
      </p>
    </div>
  );
}

LongformAgreement.defaultProps = {
  title: '',
  intro: '',
  inputValue: '',
  inputChecked: false,
  inputOnChange: () => {},
  isValid: true,
  errorMessage: '',
  disabled: false,
};
