import { Fragment } from 'react';
import { BRANCHESOFSERVICE, SERVICEMEMBERSTATUS } from '@src/API';
import { mapEnumValue } from '@utils/mapEnumValue';
import formatPhoneNumber from '@utils/formatPhoneNumber';

export default function ServiceMemberBlock(props) {
  if (props.member && props.member?.first_name && props.member?.last_name) {
    const name =
      props.member.first_name +
      ' ' +
      (props.member.middle_initial ?? '') +
      ' ' +
      props.member.last_name;

    return (
      <Fragment>
        <h4>Service Member</h4>
        <div className={`detail-block`}>
          <p>
            {name}
            <br />
            {props.member.telephone && (
              <Fragment>
                {
                  formatPhoneNumber(props.member.telephone, props.member.extension)
                }
                <br />
              </Fragment>
            )}
            {props.member.email && (
              <Fragment>
                <a href={`mailto:${props.member.email}`}>{props.member.email}</a>
              </Fragment>
            )}
          </p>
          {props.member.branch_of_service && (
            <p>
              <strong>Branch: </strong>{' '}
              {mapEnumValue(BRANCHESOFSERVICE[props.member.branch_of_service])}
            </p>
          )}
          {props.member.current_status && (
            <p>
              <strong>Status: </strong>{' '}
              {mapEnumValue(SERVICEMEMBERSTATUS[props.member.current_status])}
            </p>
          )}
          {props.member.base_assigned && (
            <p>
              <strong>Assigned VA: </strong> {props.member.base_assigned}
            </p>
          )}
          {props.member.base_assigned != props.member.treatment_facility && (
            <p>
              <strong>The assigned VA is different than the treatment facility.</strong>
            </p>
          )}
        </div>
      </Fragment>
    );
  }
  return null;
}

ServiceMemberBlock.defaultProps = {
  member: {},
};
