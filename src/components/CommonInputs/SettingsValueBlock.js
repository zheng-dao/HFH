import { Fragment, useState } from 'react';
import uniqueId from '@utils/uniqueId';

export default function SettingsValueBlock(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  let value = '';
  if (props.value != null) {
    value = props.value;
  }

  return (
    <Fragment>
      <h4>{props.title}</h4>

      <div className="detail-block">
        {props.description && <p>{props.description}</p>}

        <label htmlFor={htmlId}>{props.label}</label>
        <input
          type="text"
          disabled={props.inputDisabled}
          id={htmlId}
          value={value}
          required={true}
          onChange={props.onChange}
        />
      </div>
    </Fragment>
  );
}

SettingsValueBlock.defaultProps = {
  title: '',
  description: '',
  label: '',
  value: '',
  onChange: () => {},
  inputDisabled: false,
};
