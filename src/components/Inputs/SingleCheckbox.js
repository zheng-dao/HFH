import uniqueId from '@utils/uniqueId';
import { useState } from 'react';
import Checkboxfield from './Checkboxfield';

export default function SingleCheckbox(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = !props.isValid ? 'error' : '';

  return (
    <fieldset className={`checkboxes single ${props.wrapperClass}`}>
      <Checkboxfield {...props} />
    </fieldset>
  );
}

SingleCheckbox.defaultProps = {
  label: 'My Label',
  wrapperClass: '',
  inputValue: '',
  inputChecked: false,
  inputRequired: false,
  inputOnChange: () => {},
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  childProps: {},
  inputDisabled: false,
};
