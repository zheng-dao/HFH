import { Fragment } from 'react';
import formatPhoneNumber from '@utils/formatPhoneNumber';

export default function ReferrerBlock(props) {
  if (props.applicant && props.applicant?.first_name && props.applicant?.last_name) {
    const name =
      props.applicant.first_name +
      ' ' +
      (props.applicant.middle_initial ?? '') +
      ' ' +
      props.applicant.last_name;
      
    return (
      <Fragment>
        <h4>Referrer</h4>
        <div className={`detail-block`}>
          <p>
            {name}
            <br />
            {props.applicant.job && (
              <Fragment>
                {props.applicant.job}
                <br />
              </Fragment>
            )}
            {props.applicant.Affiliation?.name && (
              <Fragment>
                {props.applicant.Affiliation?.name}
                <br />
              </Fragment>
            )}
            {props.applicant.telephone && (
              <Fragment>
                {
                  formatPhoneNumber(props.applicant?.telephone, props.applicant?.extension)
                }
                <br />
              </Fragment>
            )}
            {props.applicant.email && (
              <Fragment>
                <a href={`mailto:${props.applicant.email}`}>{props.applicant.email}</a>
              </Fragment>
            )}
          </p>
        </div>
      </Fragment>
    );
  }
  return null;
}

ReferrerBlock.defaultProps = {
  applicant: {},
};
