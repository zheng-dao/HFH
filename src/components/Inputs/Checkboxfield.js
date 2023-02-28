import uniqueId from '@utils/uniqueId';
import classNames from 'classnames';
import { useState } from 'react';

export default function Checkboxfield(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = !props.isValid ? 'error' : '';

  const labelClass = classNames(
    {
      error: !props.isValid,
      checked: props.inputChecked,
    },
    props.labelClassName
  );

  const inputClass = classNames({
    checked: props.inputChecked,
  });

  return (
    <label htmlFor={htmlId} className={labelClass}>
      <input
        type="checkbox"
        disabled={props.inputDisabled}
        value={props.inputValue}
        checked={props.inputChecked}
        onChange={props.inputOnChange}
        id={htmlId}
        className={inputClass}
      />{' '}
      {props.label}{' '}
    </label>
  );
}

Checkboxfield.defaultProps = {
  label: 'My Label',
  inputValue: '',
  inputChecked: false,
  inputRequired: false,
  inputOnChange: () => {},
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  childProps: {},
  labelClassName: '',
  inputDisabled: false,
};
