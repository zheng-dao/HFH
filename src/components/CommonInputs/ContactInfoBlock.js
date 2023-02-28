import Emailfield from '@components/Inputs/Emailfield';
import Telephonefield from '@components/Inputs/Telephonefield';
import Textfield from '@components/Inputs/Textfield';
import { Fragment } from 'react';

export default function ContactInfoBlock(props) {
  return (
    <Fragment>
      <Emailfield
        label={props.emailLabel}
        labelCount={props.emailCount}
        inputDisabled={props.inputDisabled}
        wrapperClass="email"
        inputValue={props.emailValue}
        inputOnChange={props.emailOnChange}
        inputRequired={true}
        inputOnBlur={props.emailOnBlur}
        isValid={props.emailValid.valid}
        errorMessage={props.emailValid.message}
        childProps={{ disabled: props.emailDisabled }}
        fieldName="email"
      />

      <div className="tel-block">
        <Telephonefield
          label={props.telephoneLabel}
          labelCount={props.telephoneCount}
          inputDisabled={props.inputDisabled}
          wrapperClass="telephone"
          inputValue={props.telephoneValue}
          inputOnChange={props.telephoneOnChange}
          inputRequired={true}
          inputOnBlur={props.telephoneOnBlur}
          isValid={props.telephoneValid.valid}
          errorMessage={props.telephoneValid.message}
          childProps={{ disabled: props.telephoneDisabled }}
          fieldName="telephone"
        />

        <Textfield
          label={props.extensionLabel}
          labelCount={props.extensionCount}
          inputDisabled={props.inputDisabled}
          wrapperClass="extension"
          inputValue={props.extensionValue}
          inputOnChange={props.extensionOnChange}
          inputRequired={true}
          inputOnBlur={props.extensionOnBlur}
          isValid={props.extensionValid.valid}
          errorMessage={props.extensionValid.message}
          childProps={{ disabled: props.extensionDisabled }}
          fieldName="extension"
        />
      </div>
    </Fragment>
  );
}

ContactInfoBlock.defaultProps = {
  emailValue: '',
  emailDisabled: false,
  emailOnChange: () => {},
  emailOnBlur: () => {},
  emailValid: false,
  emailLabel: 'Email',
  emailCount: -1,
  telephoneValue: '',
  telephoneDisabled: false,
  telephoneOnChange: () => {},
  telephoneOnBlur: () => {},
  telephoneValid: false,
  telephoneLabel: 'Telephone',
  telephoneCount: -1,
  extensionValue: '',
  extensionDisabled: false,
  extensionOnChange: () => {},
  extensionOnBlur: () => {},
  extensionLabel: 'Ext',
  extensionValid: { valid: true, message: '' },
  extensionCount: -1,
  inputDisabled: false,
};
