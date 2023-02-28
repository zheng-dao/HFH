import Textfield from '@components/Inputs/Textfield';

export default function NameBlock(props) {
  return (
    <div className="name-block">
      <Textfield
        label="First Name"
        labelCount={props.firstNameCount}
        inputDisabled={props.inputDisabled}
        wrapperClass="first-name"
        inputValue={props.firstNameValue}
        inputOnChange={props.firstNameOnChange}
        inputRequired={true}
        inputOnBlur={props.firstNameOnBlur}
        isValid={props.firstNameValid.valid}
        errorMessage={props.firstNameValid.message}
        fieldName="first_name"
      />

      <Textfield
        label="MI"
        labelCount={props.middleInitialCount}
        inputDisabled={props.inputDisabled}
        wrapperClass="mi"
        inputValue={props.middleInitialValue}
        inputOnChange={props.middleInitialOnChange}
        inputRequired={true}
        inputOnBlur={props.middleInitialOnBlur}
        isValid={true}
        errorMessage=""
        childProps={{ maxLength: 1 }}
        fieldName="middle_initial"
      />

      <Textfield
        label="Last Name"
        labelCount={props.lastNameCount}
        inputDisabled={props.inputDisabled}
        wrapperClass="last-name"
        inputValue={props.lastNameValue}
        inputOnChange={props.lastNameOnChange}
        inputRequired={true}
        inputOnBlur={props.lastNameOnBlur}
        isValid={props.lastNameValid.valid}
        errorMessage={props.lastNameValid.message}
        fieldName="last_name"
      />
    </div>
  );
}

NameBlock.defaultProps = {
  firstNameValue: '',
  firstNameOnChange: () => {},
  firstNameOnBlur: () => {},
  firstNameValid: false,
  firstNameCount: -1,
  middleInitialValue: '',
  middleInitialOnChange: () => {},
  middleInitialOnBlur: () => {},
  middleInitialValid: false,
  middleInitialCount: -1,
  lastNameValue: '',
  lastNameOnChange: () => {},
  lastNameOnBlur: () => {},
  lastNameValid: false,
  lastNameCount: -1,
  inputDisabled: false,
};
