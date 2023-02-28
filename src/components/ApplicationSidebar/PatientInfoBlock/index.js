import { Fragment } from 'react';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';

export default function PatientInfoBlock(props) {

  if (props.patientIsServiceMember) {
    return (
      <Fragment>
        <h4>Patient</h4>
        <div className="detail-block">
          <p>
            <strong>The service member is the patient.</strong>
          </p>
        </div>
      </Fragment>
    );
  }
  if (props.patient?.first_name || props.patient?.relationship) {
    return (
      <Fragment>
        <h4>Patient</h4>
        <div className="detail-block">
          <p>
            <strong>Patient: </strong> {humanName(props.patient)}
          </p>
          <p>
            <strong>Relationship: </strong> {mapEnumValue(props.patient?.relationship)}
          </p>
        </div>
      </Fragment>
    );
  }
  return null;
}

PatientInfoBlock.defaultProps = {
  patient: null,
  patientIsServiceMember: false,
};
