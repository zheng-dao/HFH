import { Fragment } from 'react';
import Radio from './Radio';
import { mapEnumValue } from '@utils/mapEnumValue';
import classNames from 'classnames';

export default function Radios(props) {
  let selectOptions = [];

  if (props.options instanceof Array) {
    selectOptions = props.options;
  } else {
    selectOptions = Object.keys(props.options).map((key) => {
      return {
        key: key,
        value: mapEnumValue(props.options[key]),
      };
    });
  }

  const renderedOptions = selectOptions.map((item) => {
    return (
      <Radio
        label={item.value}
        key={item.key}
        inputValue={item.key}
        inputOnChange={props.onChange}
        inputChecked={String(props.selected) == String(item.key)}
        inputDisabled={props.inputDisabled}
        // isValid={props.isValid}
      />
    );
  });

  const fieldsetClassNames = classNames('radios', {
    error: !props.isValid,
  });

  return (
    <Fragment>
      {!props.titleInFieldset && props.title && (
        <h4>
          {props.title}
          {props.titleCount >= 0 && (
            <Fragment>
              &nbsp;
              <abbr title={'There are ' + props.titleCount + ' unique values for this input.'}>
                ({props.titleCount})
              </abbr>
            </Fragment>
          )}
        </h4>
      )}

      {props.withFieldset && (
        <fieldset className={fieldsetClassNames}>
          {props.titleInFieldset && props.title && (
            <h4>
              {props.title}
              {props.titleCount >= 0 && (
                <Fragment>
                  &nbsp;
                  <abbr title={'There are ' + props.titleCount + ' unique values for this input.'}>
                    ({props.titleCount})
                  </abbr>
                </Fragment>
              )}
            </h4>
          )}
          {renderedOptions}
        </fieldset>
      )}
      {!props.isValid && props.errorMessage ? <p className="errMsg">{props.errorMessage}</p> : ''}

      {!props.withFieldset && renderedOptions}
    </Fragment>
  );
}

Radios.defaultProps = {
  title: '',
  titleCount: -1,
  options: [],
  selected: '',
  onChange: () => {},
  withFieldset: true,
  titleInFieldset: false,
  inputDisabled: false,
  isValid: true,
  errorMessage: '',
};
