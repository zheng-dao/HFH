import uniqueId from '@utils/uniqueId';
import { useState } from 'react';

export default function Radio(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = !props.isValid ? 'error' : '';

  return (
    <label htmlFor={htmlId} className={extraErrorClass}>
      <input
        type="radio"
        disabled={props.inputDisabled}
        value={props.inputValue}
        checked={props.inputChecked}
        onChange={props.inputOnChange}
        id={htmlId}
      />{' '}
      {props.label}{' '}
    </label>
  );
}

Radio.defaultProps = {
  label: 'My Label',
  inputValue: '',
  inputChecked: false,
  inputRequired: false,
  inputOnChange: () => {},
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  childProps: {},
  inputDisabled: false,
};
