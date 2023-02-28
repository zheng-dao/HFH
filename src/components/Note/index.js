import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import classNames from 'classnames';
import { NOTEACTION } from '@src/API';

export default function Note(props) {
  if (props.note?.timestamp) {
    const wrapperClass = classNames('detail-block', 'status', {
      // status: props.note.action != NOTEACTION.ADD_NOTE,
      // message: props.note.action == NOTEACTION.ADD_NOTE,
      submitted: props.note.action == NOTEACTION.NEW_APPLICATION,
      returned: props.note.action == NOTEACTION.RETURN,
      approved: props.note.action == NOTEACTION.APPROVE,
      ammended:
        props.note.action == NOTEACTION.CHANGE_DATA || props.note.action == NOTEACTION.CHANGE_ADMIN,
      requested: props.note.action == NOTEACTION.REQUEST_INITIAL_STAY || props.note.action == NOTEACTION.REQUEST,
      'early-checkout': false,
      completed: props.note.action == NOTEACTION.COMPLETE_INITIAL_STAY || props.note.action == NOTEACTION.COMPLETE,
      canceled: false,
      declined: props.note.action == NOTEACTION.DECLINE || (props.note.action == NOTEACTION.CLOSE && props.note?.message?.includes('deleted an Extended Stay')),
      closed: props.note.action == NOTEACTION.CLOSE && !props.note?.message?.includes('deleted an Extended Stay'),
      exception: props.note.action == NOTEACTION.REQUEST_EXCEPTION,
      reviewed: props.note.action == NOTEACTION.REVIEWED
    });

    return (
      <div className={wrapperClass}>
        <h4>{format(parseISO(props.note?.timestamp), "h:mmaaa 'on' LLL do, y")}</h4>

        <p dangerouslySetInnerHTML={{ __html: props.note?.message }} />
      </div>
    );
  } else {
    return null;
  }
}

Note.defaultProps = {
  note: {},
};
