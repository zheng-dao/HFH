import uniqueId from '@utils/uniqueId';
import { Fragment, useState } from 'react';
import valueOrEmptyString from '@utils/valueOrEmptyString';
import classNames from 'classnames';

export default function Textareafield(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = !props.isValid ? 'error' : '';

  const textAreaClassName = classNames(
    {
      error: !props.isValid,
      'no-label': !props.withActualLabel,
    },
    props.textareaClass
  );

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
        <div className="displaybox">{printedValue}</div>
      </div>
    );
  }

  return (
    <div className={`${props.wrapperClass}`}>
      {!props.withActualLabel && props.label.length > 0 && (
        <h4>
          {props.label}
          {props.labelCount >= 0 && (
            <Fragment>
              &nbsp;
              <abbr title={'There are ' + props.labelCount + ' unique values for this input.'}>
                ({props.labelCount})
              </abbr>
            </Fragment>
          )}
        </h4>
      )}

      {props.intro && <p>{props.intro}</p>}

      {props.withActualLabel && props.label.length > 0 && (
        <label className={extraErrorClass}>
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
      )}
      <textarea
        className={textAreaClassName}
        id={htmlId}
        onChange={props.inputOnChange}
        required={props.inputRequired}
        onBlur={props.inputOnBlur}
        value={valueOrEmptyString(props.inputValue)}
        disabled={props.inputDisabled}
        {...props.childProps}
      />
      {!props.isValid ? <p className="errMsg">{props.errorMessage}</p> : ''}
    </div>
  );
}

Textareafield.defaultProps = {
  wrapperClass: '',
  label: '',
  labelCount: -1,
  inputValue: '',
  inputRequired: false,
  inputOnChange: () => {},
  inputOnBlur: () => {},
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  maxLength: 128,
  childProps: {},
  textareaClass: '',
  intro: '',
  withActualLabel: false,
  inputDisabled: false,
};
