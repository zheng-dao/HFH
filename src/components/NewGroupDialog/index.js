import { useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Group, Application, Applicant } from '@src/models';
import {
  GROUPSTATUS,
  READSTATUS,
  APPLICATIONSTATUS,
  GUESTTYPE,
  STAYTYPE,
  STAYSTATUS,
  NOTEACTION,
} from '@src/API';
import useDialog from '@contexts/DialogContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  createGroup,
  createApplicant,
  createApplication,
  createServiceMember,
  createPatient,
  createGuest,
  createStay,
  updateServiceMember,
  updatePatient,
} from '@src/graphql/mutations';
import { useRouter } from 'next/router';
import useButtonWait from '@contexts/ButtonWaitContext';
import createNote from '@utils/createNote';
import humanName from '@utils/humanName';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import validateNumericRange from '@utils/validators/range';
import classNames from 'classnames';

export default function NewGroupDialog(props) {
  const [numOfApps, setNumOfApps] = useState('');
  const [groupName, setGroupName] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [groupNameValid, setGroupNameValid] = useState({ valid: true, message: '' });
  const [groupNumberOfAppsValid, setGroupNumberOfAppsValid] = useState({
    valid: true,
    message: '',
  });

  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();
  const { profile, isAdministrator } = useAuth();

  const closeDialog = (e) => {
    e.preventDefault();
    props.close();
  };

  const updateNumberOfApps = (e) => {
    setNumOfApps(e.target.value);
  };

  const updateGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const groupNameOnBlur = (e) => {
    setGroupNameValid(validateRequired(e.target.value));
  };

  const groupNumberOfAppsOnBlur = (e) => {
    setGroupNumberOfAppsValid(validateNumericRange(e.target.value, true, 1, 100));
  };

  const isValidFormSubmission = () => {
    const nameIsValid = validateRequired(groupName);
    const numberOfAppsIsValid = validateNumericRange(numOfApps, true, 1, 100);
    setGroupNameValid(nameIsValid);
    setGroupNumberOfAppsValid(numberOfAppsIsValid);
    return nameIsValid.valid && numberOfAppsIsValid.valid;
  };

  const createNewAppsForGroup = (e) => {
    e.preventDefault();
    if (!isValidFormSubmission()) {
      return;
    }
    if (parseInt(numOfApps) == numOfApps && numOfApps >= 0) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.save(
          new Group({
            name: groupName,
            status: GROUPSTATUS.ACTIVE,
          })
        ).then((group) => {
          for (let index = 0; index < numOfApps; index++) {
            DataStore.save(new Applicant({})).then((applicant) => {
              DataStore.save(
                new Application({
                  Applicant: applicant,
                  liaison_read: READSTATUS.UNREAD,
                  User: props.profile,
                  status: APPLICATIONSTATUS.DRAFT,
                  Group: group,
                })
              );
            });
          }
          setMessage('Created ' + numOfApps + ' applications and should now redirect.');
        });
      } else {
        API.graphql(
          graphqlOperation(createGroup, {
            input: {
              name: groupName,
              status: GROUPSTATUS.ACTIVE,
              groupCreatorId: props.profile?.id,
            },
          })
        )
          .then((groupResults) => {
            const createNewApplications = async () => {
              const allApplications = [];
              for (let index = 0; index < numOfApps; index++) {
                allApplications.push(
                  API.graphql(graphqlOperation(createApplicant, { input: {} }))
                    .then((results) => {
                      API.graphql(graphqlOperation(createServiceMember, { input: {} }))
                        .then((memberResults) => {
                          API.graphql(graphqlOperation(createPatient, { input: {} }))
                            .then((patientResults) => {
                              API.graphql(
                                graphqlOperation(createApplication, {
                                  input: {
                                    applicationApplicantId: results.data.createApplicant.id,
                                    liaison_read: READSTATUS.UNREAD,
                                    admin_read: READSTATUS.UNREAD,
                                    applicationUserId: isAdministrator() ? null : props.profile?.id,
                                    applicationAssignedToId: isAdministrator() ? props.profile?.id : null,
                                    status: APPLICATIONSTATUS.DRAFT,
                                    applicationServiceMemberId:
                                      memberResults.data.createServiceMember.id,
                                    applicationPatientId: patientResults.data.createPatient.id,
                                    applicationGroupId: groupResults.data.createGroup.id,
                                    AffiliationID: isAdministrator()
                                      ? null
                                      : props.profile?.AffiliationID,
                                  },
                                })
                              )
                                .then((applicationResults) => {
                                  const additionalThingsToCreate = Promise.all([
                                    API.graphql(
                                      graphqlOperation(createStay, {
                                        input: {
                                          applicationID:
                                            applicationResults.data.createApplication.id,
                                          type: STAYTYPE.INITIAL,
                                          status: STAYSTATUS.DRAFT,
                                        },
                                      })
                                    ),
                                    API.graphql(
                                      graphqlOperation(createGuest, {
                                        input: {
                                          applicationID:
                                            applicationResults.data.createApplication.id,
                                          type: GUESTTYPE.PRIMARY,
                                        },
                                      })
                                    ),
                                    API.graphql(
                                      graphqlOperation(updateServiceMember, {
                                        input: {
                                          id: memberResults.data.createServiceMember.id,
                                          serviceMemberApplicationId:
                                            applicationResults.data.createApplication.id,
                                        },
                                      })
                                    ),
                                    API.graphql(
                                      graphqlOperation(updatePatient, {
                                        input: {
                                          id: patientResults.data.createPatient.id,
                                          patientApplicationId:
                                            applicationResults.data.createApplication.id,
                                        },
                                      })
                                    ),
                                  ]);
                                  createNote(
                                    humanName(profile) + ' created the application.',
                                    NOTEACTION.NEW_APPLICATION,
                                    applicationResults.data.createApplication,
                                    profile
                                  ).then(() => {
                                    createNote(
                                      humanName(profile) +
                                        ' added the application to group ' +
                                        groupName,
                                      NOTEACTION.ADD_GROUP,
                                      applicationResults.data.createApplication,
                                      profile
                                    );
                                  });
                                  additionalThingsToCreate
                                    .then(() => {
                                      console.log('Application created.');
                                    })
                                    .catch((err) => {
                                      console.log('Caught error', err);
                                      setMessage(
                                        'There was an error creating a new application. Please try again later.'
                                      );
                                    });
                                })
                                .catch((err) => {
                                  console.log('Caught error', err);
                                  setMessage(
                                    'There was an error creating a new application. Please try again later.'
                                  );
                                });
                            })
                            .catch((err) => {
                              console.log('Caught errpr', err);
                              setMessage(
                                'There was an error creating a new application. Please try again later.'
                              );
                            });
                        })
                        .catch((err) => {
                          console.log('Caught errpr', err);
                          setMessage(
                            'There was an error creating a new application. Please try again later.'
                          );
                        });
                    })
                    .catch((err) => {
                      console.log('Caught error', err);
                      setMessage(
                        'There was an error creating a new application. Please try again later.'
                      );
                    })
                    .finally(() => {
                      setButtonDisabled(false);
                      setIsWaiting(false);
                    })
                );
              }
              Promise.all(allApplications).then(() => {
                setMessage('Created ' + numOfApps + ' applications.');
                setTimeout(() => {
                  router.push('/application/group/' + groupResults.data.createGroup.id);
                }, 2000);
              });
            };

            createNewApplications();
          })
          .catch(() => {
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const groupNameWrapperClass = classNames({
    error: !groupNameValid.valid,
  });

  const groupNameLabelClass = classNames({
    error: !groupNameValid.valid,
  });

  const groupNameInputClass = classNames('group-name', {
    error: !groupNameValid.valid,
  });

  const groupNumberOfAppsClass = classNames('number-of-apps', 'no-label', {
    error: !groupNumberOfAppsValid.valid,
  });

  return (
    <div className="dialog">
      <div className="dialog-box">
        <button type='button' className="close" onClick={closeDialog}>
          Close
        </button>
        <div className="dialog-content">
          <form>
            <h2>New Group</h2>

            <label className={groupNameLabelClass}>Group Name</label>
            <input
              className={groupNameInputClass}
              type="text"
              value={groupName}
              onChange={updateGroupName}
              onBlur={groupNameOnBlur}
            />
            {groupNameValid.message && <p className="errMsg">{groupNameValid.message}</p>}

            <p>Enter the number of blank applications you want to create.</p>
            {/* Placeholder text should be selected value */}
            <input
              type="number"
              className={groupNumberOfAppsClass}
              value={numOfApps}
              min={1}
              max={100}
              onChange={updateNumberOfApps}
              onBlur={groupNumberOfAppsOnBlur}
            />
            {groupNumberOfAppsValid.message && (
              <p className="errMsg">{groupNumberOfAppsValid.message}</p>
            )}
            <div className="dialog-controls">
              <button type='button' className="cancel" onClick={closeDialog} disabled={buttonDisabled}>
                Cancel
              </button>
              <button type='button' className="ok" onClick={createNewAppsForGroup} disabled={buttonDisabled}>
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

NewGroupDialog.defaultProps = {
  close: () => {},
  profile: {},
};
