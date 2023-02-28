import { Fragment } from 'react';
import humanName from '@utils/humanName';
import formatPhoneNumber from '@utils/formatPhoneNumber';

export default function LiaisonInformationBlock(props) {
  if (props.liaison) {
    return (
      <Fragment>
        <h4>Liaison Information</h4>
        <div className="detail-block">
          <p>
            {props.liaison?.first_name && (
              <Fragment>
                {humanName(props.liaison)}
                <br />
              </Fragment>
            )}
            {props.liaison?.job && (
              <Fragment>
                {props.liaison.job}
                <br />
              </Fragment>
            )}
            {props.liaison?.Affiliation?.name && (
              <Fragment>
                {props.liaison.Affiliation.name}
                <br />
              </Fragment>
            )}
            {props.liaison?.telephone && (
              <Fragment>
                {
                  formatPhoneNumber(props.liaison?.telephone, props.liaison?.extension)
                }
                <br />
              </Fragment>
            )}
            {props.liaison?.username && (
              <Fragment>
                <a href={'mailto:' + props.liaison.username}>{props.liaison.username}</a>
              </Fragment>
            )}
          </p>
        </div>
      </Fragment>
    );
  }
  return null;
}

LiaisonInformationBlock.defaultProps = {
  liaison: null,
};
