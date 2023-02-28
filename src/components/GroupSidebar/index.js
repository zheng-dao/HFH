import classNames from 'classnames';
import Selectfield from '../Inputs/Selectfield';
import { useCallback, useEffect, useState, Fragment } from 'react';
import { READSTATUS, GROUPSTATUS, USERSTATUS, NOTEACTION } from '@src/API';
import useAuth from '@contexts/AuthContext';
import humanName from '@utils/humanName';
import { API, graphqlOperation } from 'aws-amplify';
import { listGroups, usersByStatus, getUser, searchApplications, searchUsers } from '@src/graphql/queries';
import { updateApplication, updateGroup as updateGroupQuery } from '@src/graphql/mutations';
import useGroupDialog from '@contexts/GroupDialogContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import validateRequired from '@utils/validators/required';
import createNote from '@utils/createNote';
import useButtonWait from '@contexts/ButtonWaitContext';
import useDialog from '@contexts/DialogContext';
import isGroupEditable from '@utils/isGroupEditable';

export default function GroupSidebar(props) {
  const { isAdministrator, isLiaison, profile } = useAuth();

  const { isWaiting, setIsWaiting } = useButtonWait();
  const { setMessage } = useDialog();

  const [assignedLiaison, setAssignedLiaison] = useState();
  const [assignedLiaisonOriginal, setAssignedLiaisonOriginal] = useState();
  const [assignedLiaisonCount, setAssignedLiaisonCount] = useState(-1);
  const [assignedGroup, setAssignedGroup] = useState();
  const [assignedGroupOriginal, setAssignedGroupOriginal] = useState();
  const [assignedGroupCount, setAssignedGroupCount] = useState(-1);
  const [liaisonRead, setLiaisonRead] = useState();
  const [liaisonReadOriginal, setLiaisonReadOriginal] = useState();
  const [liaisonReadCount, setLiaisonReadCount] = useState(-1);
  const [adminRead, setAdminRead] = useState();
  const [adminReadOriginal, setAdminReadOriginal] = useState();
  const [adminReadCount, setAdminReadCount] = useState(-1);
  const [assignedAdmin, setAssignedAdmin] = useState();
  const [assignedAdminOriginal, setAssignedAdminOriginal] = useState();
  const [assignedAdminCount, setAssignedAdminCount] = useState(-1);

  const [noteText, setNoteText] = useState('');
  const [noteTextValid, setNoteTextValid] = useState({ valid: true, message: '' });

  const [allLiaisons, setAllLiaisons] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);

  const {
    shouldShowGroupChange,
    setShouldShowGroupChange,
    setApplyChangesFunction,
    applyChangesFunction,
    setCancelFunction,
    setIsAffiliationChange,
    setAffiliationID,
  } = useGroupDialog();

  useEffect(() => {
    const reduceAndSetUniqueApplicationValue = (
      field_name,
      set_function,
      set_original_function,
      set_count_function
    ) => {
      const available = props.applications.map((item) => {
        if (!isAdministrator() && field_name === 'applicationAssignedToId') {
          return item[field_name]
            ? item.AffiliationID === profile?.id
              ? item[field_name]
              : ''
            : '';
        } else {
          return item[field_name] ? item[field_name] : '';
        }
      });
      let unique = [];
      if (typeof available[0] == 'object' && available[0] != null) {
        unique = Array.from(new Set(available.map(JSON.stringify)), JSON.parse);
      } else {
        unique = [...new Set(available)];
      }
      if (unique.length > 1) {
        set_count_function(unique.length);
      }
      if (unique.length == 1) {
        set_count_function();
        if (['applicationUserId', 'applicationAssignedToId'].includes(field_name)) {
          if (unique[0] == '') {
            set_function({
              value: '',
              label: 'Unassigned',
            });
            set_original_function({
              value: '',
              label: 'Unassigned',
            });
          } else {
            if (field_name === 'applicationUserId') {
              let liaision = allLiaisons.find((item) => item.value === unique[0]);
              set_function({
                value: unique[0],
                label: liaision?.label,
              });
              set_original_function({
                value: unique[0],
                label: liaision?.label,
              });
            } else {
              let admin = allAdmins.find((item) => item.value === unique[0]);
              set_function({
                value: unique[0],
                label: admin?.label,
              });
              set_original_function({
                value: unique[0],
                label: admin?.label,
              });
            }
          }
        } else if (field_name == 'applicationGroupId' && unique[0] == '') {
          set_function({
            value: '',
            label: 'None',
          });
          set_original_function({
            value: '',
            label: 'None',
          });
        } else {
          set_function(unique[0]);
          set_original_function(unique[0]);
        }
      }
    };

    reduceAndSetUniqueApplicationValue(
      'applicationUserId',
      setAssignedLiaison,
      setAssignedLiaisonOriginal,
      setAssignedLiaisonCount
    );
    reduceAndSetUniqueApplicationValue(
      'applicationGroupId',
      setAssignedGroup,
      setAssignedGroupOriginal,
      setAssignedGroupCount
    );
    reduceAndSetUniqueApplicationValue(
      'liaison_read',
      setLiaisonRead,
      setLiaisonReadOriginal,
      setLiaisonReadCount
    );
    reduceAndSetUniqueApplicationValue(
      'admin_read',
      setAdminRead,
      setAdminReadOriginal,
      setAdminReadCount
    );
    reduceAndSetUniqueApplicationValue(
      'applicationAssignedToId',
      setAssignedAdmin,
      setAssignedAdminOriginal,
      setAssignedAdminCount
    );
  }, [props.applications, isAdministrator, profile?.id, allAdmins, allLiaisons]);

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
    let variables = {
      filter: {
        status: { eq: USERSTATUS.ACTIVE },
      },
      limit: 100,
    };
    if (token) {
      variables['nextToken'] = token;
    }
    let results = await API.graphql(
      graphqlOperation(searchUsers, variables)
    );

    let finalResults = [];
    if (results.data.searchUsers && results.data.searchUsers.nextToken) {
      const moreResults = await getActiveUsers(results.data.searchUsers.nextToken);
      finalResults = results.data.searchUsers.items.concat(moreResults);
    } else {
      finalResults = results.data.searchUsers.items;
    }
    return finalResults.filter(result => result.status === USERSTATUS.ACTIVE);
  }, []);

  const getLiaisons = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Admins', null)]).then((values) => {
        let usersFromAPI = values[0]?.sort((a, b) =>
          humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        );
        usersFromAPI = usersFromAPI.filter(
          (item, index, self) => index === self.findIndex((t) => t.username === item.username)
        );
        usersFromAPI = usersFromAPI.filter((item) => !item._deleted && item.id);
        const admins = values[1];
        const unassignedOption = [{ value: '', label: 'Unassigned' }];
        resolve(
          unassignedOption.concat(
            usersFromAPI
              .filter((item) => !admins.includes(item.owner))
              .filter((item) =>
                isLiaison() ? profile?.AffiliationID == item?.AffiliationID : true
              )
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
          )
        );
      });
    });
  }, [getActiveUsers, getUsersInGroup, isLiaison, profile?.AffiliationID]);

  const getAdmins = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Admins', null)]).then((values) => {
        let usersFromAPI = values[0]?.sort((a, b) =>
          humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        );
        usersFromAPI = usersFromAPI.filter(
          (item, index, self) => index === self.findIndex((t) => t.username === item.username)
        );
        usersFromAPI = usersFromAPI.filter((item) => !item._deleted && item.id);
        const usersFromAdmins = values[1];
        const unassignedOption = [{ value: '', label: 'Unassigned' }];
        resolve(
          unassignedOption.concat(
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
          )
        );
      });
    });
  }, [getActiveUsers, getUsersInGroup]);

  const getGroups = useCallback(async () => {
    let filter = {};
    if (isLiaison()) {
      const appResults = await API.graphql(
        graphqlOperation(searchApplications, {
          filter: {
            applicationGroupId: {
              exists: true,
            },
            AffiliationID: {
              eq: profile?.AffiliationID,
            },
          },
        })
      );
      if (appResults.data.searchApplications.items.length == 0) {
        return [];
      }
      filter = {
        status: { eq: GROUPSTATUS.ACTIVE },
        or: appResults.data.searchApplications.items.map((item) => {
          return { id: { eq: item.applicationGroupId } };
        }),
      };
    } else {
      filter = {
        status: { eq: GROUPSTATUS.ACTIVE },
      };
    }
    try {
      let results = await API.graphql(graphqlOperation(listGroups, { limit: 100000, filter }));
      if (results.data.listGroups.items) {
        const noneOption = [{ value: '', label: 'None' }];
        const sortedResults = results.data.listGroups.items.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        return noneOption.concat(
          sortedResults
            .filter((item) => !item['_deleted'])
            .map((item) => {
              return { value: item.id, label: item.name };
            })
        );
      } else {
        return [];
      }
    } catch (error) {
      console.log('getGroups: ', error);
      return [];
    }
    
  }, [profile?.AffiliationID, isLiaison]);

  useEffect(() => {
    getGroups().then((ret) => {
      setAllGroups(ret);
    });
  }, [getGroups]);

  useEffect(() => {
    getAdmins().then((ret) => {
      setAllAdmins(ret);
    });
  }, [getAdmins]);

  useEffect(() => {
    getLiaisons().then((ret) => {
      setAllLiaisons(ret);
    });
  }, [getLiaisons]);

  const handleBlur = (field, value) => {
    if (value == null || value == '' || value.length > 0) {
      if (field == 'email' && !validateEmail(value).valid) {
        return;
      } else if (field == 'telephone' && !validatePhoneNumber(value).valid) {
        return;
      }
      switch (field) {
        case 'applicationUserId':
          if (assignedLiaisonOriginal?.value !== value) {
            if (
              assignedLiaisonOriginal?.value === '' &&
              assignedLiaisonOriginal?.label === 'Unassigned'
            ) {
              const app = props.applications[0];
              if (value && value !== '') {
                let updatedLiaison = allLiaisons.find((item) => item.value === value);
                if (
                  app.AffiliationID === null ||
                  app.AffiliationID === undefined ||
                  app.AffiliationID === updatedLiaison?.AffiliationID
                ) {
                  setIsAffiliationChange(false);
                } else {
                  setAffiliationID(updatedLiaison?.AffiliationID);
                  setIsAffiliationChange(true);
                }
              }
            } else {
              let originalLiaison = allLiaisons.find(
                (item) => item.value === assignedLiaisonOriginal?.value
              );
              let updatedLiaison = allLiaisons.find((item) => item.value === value);
              if (originalLiaison?.AffiliationID !== updatedLiaison?.AffiliationID) {
                if (!value) {
                  setIsAffiliationChange(false);
                } else {
                  setAffiliationID(updatedLiaison?.AffiliationID);
                  setIsAffiliationChange(true);
                }
              } else {
                setIsAffiliationChange(false);
              }
            }
          }
          setCancelFunction(() => () => {
            setAssignedLiaison(assignedLiaisonOriginal);
            setIsAffiliationChange(false);
          });
          break;

        case 'applicationGroupId':
          setCancelFunction(() => () => setAssignedGroup(assignedGroupOriginal));
          break;

        case 'liaison_read':
          setCancelFunction(() => () => setLiaisonRead(liaisonReadOriginal));
          break;

        case 'admin_read':
          setCancelFunction(() => () => setAdminRead(adminReadOriginal));
          break;

        case 'applicationAssignedToId':
          setCancelFunction(() => () => setAssignedAdmin(assignedAdminOriginal));
          break;

        default:
          setCancelFunction(() => () => { });
          break;
      }
      setApplyChangesFunction(() => () => {
        let applicationCounts = props.applications ? props.applications.length : 0;
        setIsWaiting(true);
        props.applications.forEach((app) => {
          if (shouldUseDatastore()) {
            console.log('Group actions via Datastore are not supported.');
          } else {
            let newInput = {
              id: app.id,
            };
            newInput[field] = value;
            if (field == 'applicationUserId') {
              if (value !== '') {
                let updatedLiaison = allLiaisons.find((item) => item.value === value);
                if (updatedLiaison && updatedLiaison.AffiliationID) {
                  newInput['AffiliationID'] = updatedLiaison.AffiliationID;
                }
              }
            }
            API.graphql(graphqlOperation(updateApplication, { input: newInput }))
              .then(() => {
                applicationCounts--;
                if (field == 'applicationGroupId') {
                  props.removeApplicationFromList(app.id);
                }
                switch (field) {
                  case 'applicationUserId':
                    setIsAffiliationChange(false);
                    setShouldShowGroupChange(false);
                    setAssignedLiaison(value);
                    setAssignedLiaisonOriginal(value);
                    break;

                  case 'applicationGroupId':
                    // If we are changing the group, we know we are being left with no applications. So unarchive the group.
                    API.graphql(
                      graphqlOperation(updateGroupQuery, {
                        input: { id: props.groupId, status: GROUPSTATUS.ACTIVE },
                      })
                    )
                      .then(() => {
                        console.log('applicationGroupId change');
                        setAssignedGroup(value);
                        setAssignedGroupOriginal(value);
                      })
                      .catch((error) => {
                        // Worst case, we just leave the group in archived status.
                        console.log(
                          '// Worst case, we just leave the group in archived status.',
                          error
                        );
                      });
                    break;

                  case 'liaison_read':
                    setLiaisonRead(value);
                    setLiaisonReadOriginal(value);
                    break;

                  case 'admin_read':
                    setAdminRead(value);
                    setAdminReadOriginal(value);
                    break;

                  case 'applicationAssignedToId':
                    setAssignedAdmin(value);
                    setAssignedAdminOriginal(value);
                    break;

                  default:
                    break;
                }
                if (applicationCounts === 0) {
                  setIsWaiting(false);
                  setIsAffiliationChange(false);
                  setShouldShowGroupChange(false);
                }
              })
              .catch((err) => {
                console.log('Caught error', err);
                setMessage(
                  'There was an error saving the Applicant. Please reload the page and try again.'
                );
              });
          }
        });
      });
      setShouldShowGroupChange(true);
    }
  };

  const handleNewNoteSubmission = (e) => {
    e.preventDefault();
    const is_valid = validateRequired(noteText);
    setNoteTextValid(is_valid);
    if (!is_valid.valid) {
      return;
    }
    props.applications.forEach((app) => {
      createNote(
        humanName(profile) + ' left the note: ' + noteText,
        NOTEACTION.ADD_NOTE,
        app,
        profile
      );
    });
    setNoteText('');
  };

  const appPaneClassNames = classNames('app-pane', {
    loading: props.shouldShowLoadingIndicator,
  });

  const historyClassNames = classNames('history-and-notes', 'app-pane', {
    loading: props.shouldShowLoadingIndicator,
  });

  const noteTextareaClassNames = classNames('no-count', 'no-label', {
    error: !noteTextValid.valid,
  });

  const selectFieldPlaceholderText = (isUnassignable) => {
    if (props.applications && props.applications.length == 0) {
      if (isUnassignable) {
        return 'Unassigned';
      } else {
        return 'None';
      }
    } else {
      return 'Varies';
    }
  };

  return (
    <div className="sidebar">
      <div className={appPaneClassNames}>
        <form>
          <Fragment>
            <Selectfield
              label="Admin"
              labelCount={assignedAdminCount}
              wrapperClass="admin"
              placeholder={selectFieldPlaceholderText(true)}
              options={allAdmins}
              blankValue=""
              useReactSelect
              inputValue={assignedAdmin}
              inputOnChange={(e) => {
                if (e?.value == '') {
                  setAssignedAdmin({
                    value: '',
                    label: 'Unassigned',
                  });
                } else {
                  setAssignedAdmin(e?.value);
                }
                handleBlur('applicationAssignedToId', e?.value || '');
              }}
              isClearable={false}
              isSideBar={true}
              inputDisabled={isAdministrator() ? false : true}
            />
            <Selectfield
              label="Liaison"
              labelCount={assignedLiaisonCount}
              wrapperClass="liaison"
              blankValue=""
              placeholder={selectFieldPlaceholderText(true)}
              options={allLiaisons}
              useReactSelect
              inputValue={assignedLiaison}
              inputOnChange={(e) => {
                if (e?.value == '') {
                  setAssignedLiaison({
                    value: '',
                    label: 'Unassigned',
                  });
                } else {
                  setAssignedLiaison(e?.value);
                }
                handleBlur('applicationUserId', e?.value || '');
              }}
              isClearable={false}
              inputDisabled={isLiaison() ? false : !isGroupEditable(props.applications)}
            />

            <Selectfield
              label="Group"
              labelCount={assignedGroupCount}
              options={allGroups}
              blankValue=""
              inputValue={assignedGroup}
              inputOnChange={(e) => {
                if (e?.value == '') {
                  setAssignedGroup({
                    value: '',
                    label: 'None',
                  });
                } else {
                  setAssignedGroup(e?.value);
                }
                handleBlur('applicationGroupId', e?.value === '' ? 'None' : e?.value);
                // If we are changing the group, we know we are being left with no applications. So unarchive the group.
                API.graphql(
                  graphqlOperation(updateGroupQuery, {
                    input: { id: props.groupId, status: GROUPSTATUS.ACTIVE },
                  })
                )
                  .then(() => {
                    console.log('applicationGroupId change');
                  })
                  .catch((error) => {
                    // Worst case, we just leave the group in archived status.
                    console.log(
                      '// Worst case, we just leave the group in archived status.',
                      error
                    );
                  });
              }}
              useReactSelect
              isClearable={false}
              placeholder={selectFieldPlaceholderText(false)}
              inputDisabled={!isGroupEditable(props.applications)}
            />

            {isAdministrator() && (
              < Selectfield
                label="Admin Read / Unread"
                labelCount={adminReadCount}
                options={READSTATUS}
                inputRequired={true}
                inputValue={adminRead}
                inputOnChange={(e) => {
                  setAdminRead(e?.value);
                  handleBlur('admin_read', e?.value);
                }}
                blankValue={false}
                useReactSelect
                isClearable={false}
                placeholder={selectFieldPlaceholderText(false)}
                inputDisabled={!isGroupEditable(props.applications)}
              />
            )}

            <Selectfield
              label="Liaison Read / Unread*"
              labelCount={liaisonReadCount}
              options={READSTATUS}
              inputRequired={true}
              inputValue={liaisonRead}
              inputOnChange={(e) => {
                setLiaisonRead(e?.value);
                handleBlur('liaison_read', e?.value);
              }}
              blankValue={false}
              useReactSelect
              isClearable={false}
              placeholder={selectFieldPlaceholderText(false)}
              inputDisabled={!isGroupEditable(props.applications)}
            />
          </Fragment>

          <p className="ui-caption">*Select Unread to keep this application in your inbox.</p>
        </form>
      </div>
      <div className={historyClassNames}>
        <textarea
          className={noteTextareaClassNames}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        // onBlur={(e) => setNoteTextValid(validateRequired(e.target.value))}
        />
        {/* {noteTextValid.message && <p className="errMsg">{noteTextValid.message}</p>} */}
        <div className="history-controls">
          <button className="add" onClick={handleNewNoteSubmission}>
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

GroupSidebar.defaultProps = {
  shouldShowLoadingIndicator: false,
  applications: [],
  groupId: '',
  removeApplicationFromList: () => { },
};
