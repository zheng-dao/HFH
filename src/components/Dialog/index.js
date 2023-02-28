import PrimaryButton from '../Inputs/PrimaryButton';
import useDialog from '@contexts/DialogContext';
import router from 'next/router';

export default function Dialog() {
  const { message, clearMessage, setNoApplications } = useDialog();

  if (message && message.length > 0) {
    return (
      <div className="dialog">
        <div className="dialog-box">
          <button className="close" onClick={() => clearMessage()}>
            Close
          </button>
          <div className="dialog-content">
            <div>
              <p>{message}</p>
            </div>
            <button className="ok" onClick={() => {
              if (message === 'Your application has been deleted.') {
                setNoApplications(true);
              }
              if (message === 'There are no applications in this group.') {
                setNoApplications(false);
                router.push('/application/group');
              }
              clearMessage();
            }}>
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
