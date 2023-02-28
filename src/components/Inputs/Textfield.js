import uniqueId from '@utils/uniqueId';
import { Fragment, useState } from 'react';
import valueOrEmptyString from '@utils/valueOrEmptyString';
import classNames from 'classnames';
import PhoneInput from 'react-phone-number-input/input';
import PhoneInputWithSelect from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function Textfield(props, children) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = !props.isValid ? 'error' : '';

  const inputClass = classNames(props.inputClass, {
    error: !props.isValid,
  });

  const wrapperClass = props.inputType !== 'tel' ?
    classNames('input-combo', props.wrapperClass, {
      error: !props.isValid,
    })
    :
    props.defaultCountry !== '' ?
      classNames('input-combo', props.wrapperClass, {
        error: !props.isValid,
      })
      :
      classNames('input-combo', props.wrapperClass, { blur }, {
        error: !props.isValid,
      });

  const CustomInput = props.inputType == 'tel' ? PhoneInputWithSelect : `input`;

  const extraProps =
    props.inputType == 'tel'
      ? {
        defaultCountry: props.defaultCountry,
        withCountryCallingCode: true,
        international: true,
      }
      : {};

  if (props.inputDisabled) {
    let printedValue = valueOrEmptyString(props.inputValue);
    if (printedValue == '') {
      printedValue = <p dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    } else {
      printedValue = <p>{printedValue}</p>;
    }
    return (
      <div className={`input-combo ${props.wrapperClass}`}>
        <label className="disabled">{props.label}</label>
        <div className="displaybox cost">{printedValue}</div>
        {props.children && <div className="displaybox">{props.children}&nbsp;</div>}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <label className={extraErrorClass} htmlFor={htmlId}>
        {props.label}
        {props.labelCount >= 0 && (
          <Fragment>
            &nbsp;
            <abbr title={'There are ' + props.labelCount + ' unique values for this input.'}>
              ({props.labelCount})
            </abbr>
          </Fragment>
        )}
      </label>
      <CustomInput
        className={inputClass}
        disabled={props.inputDisabled}
        type={props.inputType}
        id={htmlId}
        value={valueOrEmptyString(props.inputValue)}
        onChange={props.inputOnChange}
        maxLength={props.maxLength}
        required={props.inputRequired}
        onBlur={props.inputOnBlur}
        {...props.childProps}
        data-field={props.fieldName}
        {...extraProps}
      />
      {props.children}
      {!props.isValid && props.errorMessage ? <p className="errMsg">{props.errorMessage}</p> : ''}
    </div>
  );
}

Textfield.defaultProps = {
  wrapperClass: 'something',
  label: 'My Label',
  labelCount: -1,
  inputType: 'text',
  inputValue: '',
  inputRequired: false,
  inputOnChange: () => { },
  inputOnBlur: () => { },
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  maxLength: 128,
  childProps: {},
  fieldName: '',
  inputDisabled: false,
  inputClass: '',
  defaultCountry: 'US',
};
