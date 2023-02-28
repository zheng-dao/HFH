import { Fragment, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Applicant, Application } from '@src/models';
import { useRouter } from 'next/router';
import useDialog from '@contexts/DialogContext';
import {
  READSTATUS,
  APPLICATIONSTATUS,
  NOTEACTION,
  GUESTTYPE,
  STAYTYPE,
  STAYSTATUS,
} from '@src/API';
import createNote from '@utils/createNote';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  createApplicant,
  createApplication,
  createServiceMember,
  createPatient,
  createGuest,
  createStay,
  updateServiceMember,
  updatePatient,
} from '@src/graphql/mutations';
import humanName from '@utils/humanName';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function ListHeader(props) {
  const router = useRouter();
  const { setMessage } = useDialog();
  const { profile, isAdministrator } = useAuth();
  const { setIsWaiting } = useButtonWait();

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleNewApplicationClick = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (shouldUseDatastore()) {
      DataStore.save(new Applicant({}))
        .then((applicant) => {
          DataStore.save(
            new Application({
              Applicant: applicant,
              liaison_read: READSTATUS.UNREAD,
              admin_read: READSTATUS.UNREAD,
              User: props.profile,
              status: APPLICATIONSTATUS.DRAFT,
            })
          )
            .then((application) => {
              createNote('Application created.', NOTEACTION.NEW_APPLICATION, application, profile);
              router.push('/application/' + application.id);
            })
            .catch((e) => {
              setMessage('There was an error creating a new application. Please try again later. ');
            });
        })
        .catch((e) => {
          setMessage('There was an error creating a new application. Please try again later.');
        });
    } else {
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
                        // AssignedTo: isAdministrator() ? props.profile : null,
                        applicationAssignedToId: isAdministrator() ? props.profile?.id : null,
                        applicationUserId: isAdministrator() ? null : props.profile?.id,
                        status: APPLICATIONSTATUS.DRAFT,
                        applicationServiceMemberId: memberResults.data.createServiceMember.id,
                        applicationPatientId: patientResults.data.createPatient.id,
                        AffiliationID: isAdministrator() ? null : props.profile?.AffiliationID,
                      },
                    })
                  )
                    .then((applicationResults) => {
                      const additionalThingsToCreate = Promise.all([
                        API.graphql(
                          graphqlOperation(createStay, {
                            input: {
                              applicationID: applicationResults.data.createApplication.id,
                              type: STAYTYPE.INITIAL,
                              status: STAYSTATUS.DRAFT,
                            },
                          })
                        ),
                        API.graphql(
                          graphqlOperation(createGuest, {
                            input: {
                              applicationID: applicationResults.data.createApplication.id,
                              type: GUESTTYPE.PRIMARY,
                            },
                          })
                        ),
                        createNote(
                          humanName(profile) + ' created the application.',
                          NOTEACTION.NEW_APPLICATION,
                          applicationResults.data.createApplication,
                          profile
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
                              patientApplicationId: applicationResults.data.createApplication.id,
                            },
                          })
                        ),
                      ]);
                      additionalThingsToCreate
                        .then(() => {
                          router.push(
                            '/application/' + applicationResults.data.createApplication.id
                          );
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
              setMessage('There was an error creating a new application. Please try again later.');
            });
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage('There was an error creating a new application. Please try again later.');
        })
        .finally(() => {
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const handleNewGroupClick = (e) => {
    e.preventDefault();
    props.onNewGroupClick(e);
  };

  if (props.title.length < 1) {
    return null;
  }

  return (
    <header className="list-header">
      <h1>
        {props.title}

        <div className="new">
          {props.shouldHaveNewApplicationButton && (
            <button className="add" onClick={handleNewApplicationClick} disabled={buttonDisabled}>
              New Application
            </button>
          )}

          {props.shouldHaveNewGroupButton && (
            <button className="add" onClick={handleNewGroupClick} disabled={buttonDisabled}>
              New Group
            </button>
          )}
        </div>
      </h1>

      {props.children && <Fragment>{props.children}</Fragment>}
    </header>
  );
}

ListHeader.defaultProps = {
  title: '',
  shouldHaveNewApplicationButton: false,
  shouldHaveNewGroupButton: false,
  onNewGroupClick: () => {},
  profile: {},
};
