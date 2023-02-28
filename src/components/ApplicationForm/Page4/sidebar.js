import { Fragment } from 'react';
import Notes from '@components/Notes';
import ApplicationFiles from '@components/ApplicationFiles';
import humanName from '@utils/humanName';
import useApplicationContext from '@contexts/ApplicationContext';
import classNames from 'classnames';

export default function ApplicationFormPage4Sidebar(props) {
  const { initialStay, extendedStays, applicant } = useApplicationContext();

  const containerClass = classNames('inner', 'sidebar', {
    loading: props.shouldShowLoadingIndicator,
  });

  return (
    <div className={containerClass}>
      <Notes applicationId={props.application?.id} application={props.application} />

      {props.application?.id && (
        <ApplicationFiles
          serviceMemberName={
            props.application?.ServiceMember ? humanName(props.application.ServiceMember) : ''
          }
          applicationId={props.application?.id}
          application={props.application}
          initialStay={initialStay}
          extendedStays={extendedStays}
          applicant={applicant}
        />
      )}

      {/* <div className="files app-pane">
        <div className="pdf-panel">
          <form id="#" action="#">
            <h3>Files</h3>

            <div className="files">
              <ul>
                <li>
                  <label>
                    <input type="checkbox" /> Application Summary
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> Jones 12/2/17 (3 Stays)
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> Jones 12/18/17 (1 Stay)
                  </label>
                </li>
              </ul>
            </div>

            <div className="pdf-controls">
              <button className="download">Download</button>
              <button className="view">View</button>
              <button className="send-email">Email</button>
            </div>

            <div className="send-panel hidden">
              <h4>Email Recipients</h4>

              <fieldset className="checkboxes">
                <label>
                  <input type="checkbox" /> Admin <span>First Last, email@emailaddress.com</span>
                </label>
                <label>
                  <input type="checkbox" /> Liaison <span>First Last, email@emailaddress.com</span>
                </label>
                <label>
                  <input type="checkbox" /> Referrer <span>First Last, email@emailaddress.com</span>
                </label>
                <label>
                  <input type="checkbox" /> Service Member{' '}
                  <span>First Last, email@emailaddress.com</span>
                </label>
                <label>
                  <input type="checkbox" /> Primary Guest{' '}
                  <span>First Last, email@emailaddress.com</span>
                </label>
              </fieldset>

              <label>Additional Email Addresses</label>
              <input type="text" />
              <p className="ui-caption">(Separate addresses with commas)</p>

              <button>Send Email</button>
            </div>
          </form>
        </div>
      </div> */}
    </div>
  );
}

ApplicationFormPage4Sidebar.defaultProps = {
  shouldShowLoadingIndicator: false,
};
