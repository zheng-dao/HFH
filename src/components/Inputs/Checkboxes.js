import { Fragment } from 'react';
import { mapEnumValue } from '@utils/mapEnumValue';
import Checkboxfield from './Checkboxfield';
import classNames from 'classnames';

export default function Checkboxes(props) {
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
      <Checkboxfield
        label={item.value}
        key={item.key}
        inputValue={item.key}
        inputOnChange={props.onChange}
        inputChecked={props.selected && props.selected.includes(item.key)}
        inputDisabled={props.inputDisabled}
      />
    );
  });

  const fieldsetClasses = classNames('checkboxes', { 'with-label': props.withLabel });

  return (
    <Fragment>
      {props.title && !props.withLabel && (
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

      {props.title && props.withLabel && (
        <label>
          {props.title}
          {props.titleCount >= 0 && (
            <Fragment>
              &nbsp;
              <abbr title={'There are ' + props.titleCount + ' unique values for this input.'}>
                ({props.titleCount})
              </abbr>
            </Fragment>
          )}
        </label>
      )}

      {props.withFieldset && <fieldset className={fieldsetClasses}>{renderedOptions}</fieldset>}

      {!props.withFieldset && renderedOptions}
    </Fragment>
  );
}

Checkboxes.defaultProps = {
  title: '',
  titleCount: -1,
  withLabel: false,
  options: [],
  selected: [],
  onChange: () => {},
  withFieldset: true,
  inputDisabled: false,
  fieldsetClasses: '',
};
