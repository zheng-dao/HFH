import { useState, useEffect, useCallback } from 'react';
import { DataStore, SortDirection, Predicates } from '@aws-amplify/datastore';
import { Application, Note } from '@src/models';
import { NOTEACTION, READSTATUS, USERSTATUS } from '@src/API';
import useApplicationContext from '@contexts/ApplicationContext';
import NoteElement from '@components/Note';
import classNames from 'classnames';
import createNote from '@utils/createNote';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listNotesByApplicationAndTimestamp, usersByStatus } from '@src/graphql/queries';
import { onCreateNoteByApplicationId, onCreateNote } from '@src/graphql/subscriptions';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import humanName from '@utils/humanName';
import useButtonWait from '@contexts/ButtonWaitContext';
import retrieveFirstCheckin from '@utils/retrieveFirstCheckin';
import retrieveLatestCheckout from '@utils/retrieveLatestCheckout';

export default function Notes(props) {
  const { application, initialStay, setApplication, saveApplication, serviceMember } =
    useApplicationContext();
  const { setIsWaiting } = useButtonWait();

  const [notes, setNotes] = useState([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteCounter, setNoteCounter] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [allAdmins, setAllAdmins] = useState([]);
  const [allLiaisons, setAllLiaisons] = useState([]);
  const { profile, isAdministrator, isLiaison } = useAuth();

  const getLiaisonsInGroup = useCallback(async (token) => {
    let results = await API.get('Utils', '/utils/getLiaisons', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return results;
  }, []);

  const getAdminsInGroup = useCallback(async (token) => {
    let results = await API.get('Utils', '/utils/admins', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return results;
  }, []);

  const getUsersInGroup = useCallback(
    async (groupname, token) => {
      if (groupname == 'Liaisons') {
        return getLiaisonsInGroup(token);
      } else {
        return getAdminsInGroup(token);
      }
    },
    [getLiaisonsInGroup, getAdminsInGroup]
  );

  const getActiveUsers = useCallback(async (token) => {
    let results = await API.graphql(
      graphqlOperation(usersByStatus, {
        status: USERSTATUS.ACTIVE,
        nextToken: token,
      })
    );

    let finalResults = [];
    if (results.data.UsersByStatus && results.data.UsersByStatus.nextToken) {
      const moreResults = await getActiveUsers(results.data.UsersByStatus.nextToken);
      finalResults = results.data.UsersByStatus.items.concat(moreResults);
    } else {
      finalResults = results.data.UsersByStatus.items;
    }
    return finalResults;
  }, []);

  const getLiaisons = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Liaisons', null)]).then((values) => {
        const usersFromAPI = values[0];
        const usersFromLiaisons = values[1];
        resolve(
          usersFromAPI
            .filter((item) => usersFromLiaisons.includes(item.owner))
            .filter((item) => (isLiaison() ? profile?.AffiliationID == item?.AffiliationID : true))
            .map((item) => {
              return {
                value: item.id,
                label: humanName(item),
                AffiliationID: item?.AffiliationID,
                receive_emails: item?.receive_emails,
                email: item.username,
                first_name: item.first_name,
              };
            })
        );
      });
    });
  }, [getActiveUsers, getUsersInGroup, isLiaison, profile?.AffiliationID]);

  const getAdmins = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Admins', null)]).then((values) => {
        const usersFromAPI = values[0];
        const usersFromAdmins = values[1];
        resolve(
          usersFromAPI
            .filter((item) => usersFromAdmins.includes(item.owner))
            .map((item) => {
              return {
                value: item.id,
                label: humanName(item),
                AffiliationID: item?.AffiliationID,
                receive_emails: item?.receive_emails,
                email: item.username,
                first_name: item.first_name,
              };
            })
        );
      });
    });
  }, [getActiveUsers, getUsersInGroup]);

  useEffect(() => {
    getAdmins().then((result) => setAllAdmins(result));
    getLiaisons().then((result) => setAllLiaisons(result));
  }, [getAdmins, getLiaisons]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(Note, Predicates.ALL, {
        sort: (s) => s.timestamp(SortDirection.DESCENDING),
      }).then((n) => {
        setNotes(n.filter((item) => item.Application.id === props.applicationId));
      });
    } else {
      API.graphql(
        graphqlOperation(listNotesByApplicationAndTimestamp, {
          limit: 1000,
          noteApplicationId: props.applicationId,
          sortDirection: 'DESC',
        })
      )
        .then((results) => {
          if (results.data.listNotesByApplicationAndTimestamp.items.length > 0) {
            setNotes(
              results.data.listNotesByApplicationAndTimestamp.items
                // .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item) => deserializeModel(Note, item))
            );
          }
        })
        .catch((err) => {
          console.log('Error: ', err);
        });
    }
  }, [props.applicationId, noteCounter]);

  useEffect(() => {
    const handleNewNote = (value) => {
      const newNote = deserializeModel(Note, value.data.onCreateNote);
      if (newNote.noteApplicationId == props.applicationId) {
        setNotes((prev) => [newNote, ...prev]);
      }
    };

    const subscription = API.graphql(
      graphqlOperation(onCreateNote, {
        // applicationID: props.applicationId,
      })
    ).subscribe({
      next: ({ provider, value }) => handleNewNote(value),
      error: (e) => console.log('Error when subscribed to Note updates.', e),
    });

    return () => {
      console.log('Attempting to unsubscribe.');
      subscription.unsubscribe();
    };
  }, [props.applicationId]);

  const toggleAddNoteButton = async (e) => {
    e.preventDefault();
    if (!showAddNote) {
      setShowAddNote(!showAddNote);
    } else {
      if (newNoteText.length > 0) {
        setButtonDisabled(true);
        setIsWaiting(true);
        await createNote(
          humanName(profile) + ' left the note: ' + newNoteText,
          NOTEACTION.ADD_NOTE,
          application,
          profile
        );
        let emails = [];
        let to = '';
        if (application?.applicationUserId && !application?.applicationAssignedToId) {
          emails = allAdmins.map((item) => item?.email);
          to = 'Administrators';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          application?.AffiliationID
        ) {
          emails = allLiaisons
            .filter((item) => item?.AffiliationID === application.AffiliationID)
            .map((item) => item?.email);
          to = 'Liaisons';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          !application?.AffiliationID
        ) {
          // Do nothing
        } else {
          if (isAdministrator()) {
            emails.push(application?.User?.username);
            to = humanName(application?.User);
          } else {
            emails.push(application?.AssignedTo?.username);
            to = humanName(application?.AssignedTo);
          }
        }
        if (emails.length > 0) {
          let results = await API.post('Utils', '/utils/notify/application/note', {
            body: {
              to: to,
              name: humanName(profile),
              service_member_name: humanName(serviceMember),
              stay_dates:
                retrieveFirstCheckin(initialStay) + ' - ' + retrieveLatestCheckout([initialStay]),
              note: newNoteText,
              type: isAdministrator() ? 'Admin' : 'Liaison',
              link: window.location.href,
              email: emails,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        setNewNoteText('');
        setNoteCounter(noteCounter + 1);
        saveApplication(
          Application.copyOf(application, (u) => {
            u.liaison_read = READSTATUS.UNREAD;
            u.admin_read = READSTATUS.UNREAD;
          })
        ).then((app) => setApplication(app));
        setButtonDisabled(false);
        setIsWaiting(false);
      }
      setShowAddNote(!showAddNote);
    }
  };

  const updateTextareaValue = (e) => {
    setNewNoteText(e.target.value);
  };

  const textareaClass = classNames('no-count', 'no-label', {
    hidden: !showAddNote,
  });

  const toggleShowFullHistory = (e) => {
    e.preventDefault();
    setShowFullHistory(!showFullHistory);
  };

  return (
    <div className={`history-and-notes app-pane`}>
      <h3>
        History &amp; Notes
        {notes.length > 5 && !showFullHistory && (
          <span className="history-toggle" onClick={toggleShowFullHistory}>
            Expand
          </span>
        )}
        {showFullHistory && (
          <span className="history-toggle" onClick={toggleShowFullHistory}>
            Collapse
          </span>
        )}
      </h3>

      {!showFullHistory &&
        notes
          .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id))
          .slice(0, 5)
          .map((item) => {
            if (
              !isAdministrator() &&
              (item.action === NOTEACTION.REVIEWED || item.action === NOTEACTION.REGRESS)
            ) {
              return null;
            } else {
              return <NoteElement key={item.id} note={item} />;
            }
          })}

      {showFullHistory &&
        notes
          .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id))
          .map((item) => {
            if (
              !isAdministrator() &&
              (item.action === NOTEACTION.REVIEWED || item.action === NOTEACTION.REGRESS)
            ) {
              return null;
            } else {
              return <NoteElement key={item.id} note={item} />;
            }
          })}

      <textarea
        id="add-note"
        className={textareaClass}
        value={newNoteText}
        onChange={updateTextareaValue}
      ></textarea>

      <div className="history-controls">
        <button
          className={!showAddNote ? 'add' : 'save'}
          onClick={toggleAddNoteButton}
          disabled={buttonDisabled}
        >
          {!showAddNote ? 'Add Note' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}

Notes.defaultProps = {
  applicationId: null,
  application: null,
};
