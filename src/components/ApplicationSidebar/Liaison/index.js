import Selectfield from '@components/Inputs/Selectfield';
import LiaisonInformationBlock from '../LiaisonInformationBlock';
import ReferrerBlock from '../ReferrerBlock';
import ServiceMemberBlock from '../ServiceMemberBlock';
import TreatmentFacilityBlock from '../TreatmentFacilityBlock';
import HotelPropertiesBlock from '../HotelPropertiesBlock';
import GuestBlock from '../GuestBlock';
import { READSTATUS, GROUPSTATUS, USERSTATUS, NOTEACTION, APPLICATIONSTATUS } from '@src/API';
import { Application, User } from '@src/models';
import useApplicationContext from '@contexts/ApplicationContext';
import useAuth from '@contexts/AuthContext';
import toast from 'react-hot-toast';
import { Fragment, useCallback, useEffect, useState } from 'react';
import humanName from '@utils/humanName';
import createNote from '@utils/createNote';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import {
  listGroups,
  listUsers,
  usersByStatus,
  getUser,
  applicationByGroupId,
  searchApplications,
  searchUsers,
  searchGroups
} from '@src/graphql/queries';
import { updateGroup as updateGroupQuery } from '@src/graphql/mutations';
import classNames from 'classnames';
import CheckinReminderBlock from '../CheckinReminderBlock';
import CheckoutReminderBlock from '../CheckoutReminderBlock';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import isApplicationEditable from '@utils/isApplicationEditable';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import PatientInfoBlock from '../PatientInfoBlock';
import retrieveLatestCheckout from '@utils/retrieveLatestCheckout';
import retrieveFirstCheckin from '@utils/retrieveFirstCheckin';

export default function LiaisonApplicationSidebar(props) {
  const {
    application,
    applicant,
    serviceMember,
    patient,
    setApplication,
    saveApplication,
    initialStay,
    extendedStays,
  } = useApplicationContext();
  const { isAdministrator, isLiaison, profile } = useAuth();

  const updateReadUnread = (e) => {
    const newApplication = Application.copyOf(application, (updated) => {
      updated.liaison_read = e.value;
    });
    props.updateApplicationForGroup(newApplication);
    saveApplication(newApplication)
      .then((app) => setApplication(app))
      .then(() => toast('Set Read/Unread status.'));
  };

  const updateAdminReadUnread = (e) => {
    const newApplication = Application.copyOf(application, (updated) => {
      updated.admin_read = e.value;
    });
    props.updateApplicationForGroup(newApplication);
    saveApplication(newApplication)
      .then((app) => setApplication(app))
      .then(() => toast('Set Admin Read/Unread status.'));
  };

  const staysToCheck = () => {
    if (application?.InitialStay) {
      return application.InitialStay.items.concat(
        application?.ExtendedStays?.items.filter(
          (item) => item.status !== APPLICATIONSTATUS.DRAFT
        ) || []
      );
    }
    return (
      application?.ExtendedStays?.items.filter((item) => item.status !== APPLICATIONSTATUS.DRAFT) ||
      []
    );
  };

  const shouldShowCheckinReminderBlock = () => {
    return isAdministrator();
  };

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
    const results = await API.graphql(graphqlOperation(searchUsers, variables));

    let finalResults = [];
    if (results.data.searchUsers && results.data.searchUsers.nextToken) {
      const moreResults = await getActiveUsers(results.data.searchUsers.nextToken);
      finalResults = results.data.searchUsers.items.concat(moreResults);
    } else {
      finalResults = results.data.searchUsers.items;
    }
    finalResults = finalResults.sort((a, b) =>
      humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
    );
    finalResults = finalResults.filter(
      (item, index, self) => index === self.findIndex((t) => t.username === item.username)
    );
    finalResults = finalResults.filter((item) => !item._deleted && item.id);
    finalResults = finalResults.filter(item => item.status === USERSTATUS.ACTIVE);
    return finalResults;
  }, []);

  const getActiveGroups = useCallback(async (token) => {
    let filter = {};
    if (isLiaison()) {
      const appResults = await API.graphql(
        graphqlOperation(searchApplications, {
          filter:
            profile && profile?.AffiliationID
              ? {
                applicationGroupId: {
                  exists: true,
                },
                AffiliationID: {
                  eq: profile?.AffiliationID,
                },
              }
              : {
                applicationGroupId: {
                  exists: true,
                },
              },
          limit: 9999,
        })
      );
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
    let variables = {
      filter: filter,
    };
    if (token) {
      variables['nextToken'] = token;
    }
    let results = await API.graphql(graphqlOperation(searchGroups, variables));

    let finalResults = [];
    if (results.data.searchGroups.items && results.data.searchGroups.nextToken) {
      const moreResults = await getActiveGroups(results.data.searchGroups.nextToken);
      finalResults = results.data.searchGroups.items.concat(moreResults);
    } else {
      finalResults = results.data.searchGroups.items;
    }
    return finalResults;
  }, []);

  const getAdmins = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Admins', null)]).then((values) => {
        let usersFromAPI = values[0];
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

  const getLiaisons = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Admins', null)]).then((values) => {
        let usersFromAPI = values[0];
        const admins = values[1];
        const unassignedOption = [{ value: '', label: 'Unassigned' }];
        resolve(
          unassignedOption.concat(
            usersFromAPI
              .filter((item) => !admins.includes(item.owner))
              .filter((item) =>
                isLiaison()
                  ? profile && profile?.AffiliationID
                    ? item?.AffiliationID === profile?.AffiliationID
                    : true
                  : true
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
  }, [getActiveUsers, getUsersInGroup, isLiaison, profile]);

  const getGroups = useCallback(async (token) => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveGroups()]).then((values) => {
        const noneOption = [{ value: '', label: 'None' }];
        const sortedResults = values[0]?.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        resolve(
          noneOption.concat(
            sortedResults
              .filter((item) => !item['_deleted'])
              .map((item) => {
                return { value: item.id, label: item.name };
              })
          )
        );
      });
    });
  }, [isLiaison, profile]);

  const [allLiaisons, setAllLiaisons] = useState([]);
  useEffect(() => {
    getLiaisons().then((ret) => {
      setAllLiaisons(ret);
    });
  }, [getLiaisons]);

  const updateGroup = (e) => {
    const originalGroup = application.Group;
    const newApplication = Application.copyOf(application, (updated) => {
      updated.applicationGroupId = e.value === '' ? null : e.value;
    });
    saveApplication(newApplication)
      .then((app) => {
        setApplication(app);
        console.log('Original group name', originalGroup?.name);
        console.log('New group name', app?.Group?.name);
        // return;
        props.removeApplicationFromList(app.id);
        if (originalGroup?.name != app?.Group?.name) {
          if (originalGroup?.name !== undefined) {
            if (app?.Group?.name !== undefined) {
              createNote(
                humanName(profile) +
                ' removed the application from group ' +
                originalGroup?.name +
                '.',
                NOTEACTION.REMOVE_GROUP,
                application,
                profile
              ).then(() => {
                createNote(
                  humanName(profile) + ' added the application to group ' + app?.Group?.name + '.',
                  NOTEACTION.ADD_GROUP,
                  application,
                  profile
                );
              });
            } else {
              createNote(
                humanName(profile) +
                ' removed the application from group ' +
                originalGroup?.name +
                '.',
                NOTEACTION.REMOVE_GROUP,
                application,
                profile
              );
            }
          } else {
            if (app?.Group?.name !== undefined) {
              createNote(
                humanName(profile) + ' added the application to group ' + app?.Group?.name + '.',
                NOTEACTION.ADD_GROUP,
                application,
                profile
              );
            }
          }
        }
        if (originalGroup) {
          // Does this leave the group without any applications?
          API.graphql(
            graphqlOperation(applicationByGroupId, { applicationGroupId: originalGroup.id })
          )
            .then((res) => {
              if (
                res.data.ApplicationByGroupId &&
                res.data.ApplicationByGroupId.items.length == 0
              ) {
                // Unarchive group
                API.graphql(
                  graphqlOperation(updateGroupQuery, {
                    input: { id: originalGroup.id, status: GROUPSTATUS.ACTIVE },
                  })
                ).catch(() => {
                  // Worst case, we just leave the group in archived status.
                });
              }
            })
            .catch(() => {
              // Worst case, we just leave the group in archived status.
            });
        }
      })
      .then(() => toast('Saved Group.'));
  };

  const appPaneClassNames = classNames('app-pane', {
    loading: props.shouldShowLoadingIndicator,
  });

  const summaryAppPaneClassNames = classNames('app-pane', 'summary', {
    loading: props.shouldShowLoadingIndicator,
  });

  const updateApplicationLiaison = (e) => {
    if (isAdministrator()) {
      if (application.AffiliationID) {
        if (application.User !== null) {
          if (application.User.AffiliationID != e?.AffiliationID) {
            if (e.value !== '') {
              if (
                confirm(
                  'The new Liaison has a different Affiliation than the currently assigned Liaison. Are you sure you want to change the Liaison?'
                )
              ) {
                changeApplicationLiaison(e, true);
              }
            } else {
              changeApplicationLiaison(e, true);
            }
          } else {
            changeApplicationLiaison(e, true);
          }
        } else {
          if (e.value !== '') {
            let updatedLiaison = allLiaisons.find((item) => item.value === e.value);
            if (application.AffiliationID === null ||
              application.AffiliationID === undefined ||
              application.AffiliationID === updatedLiaison?.AffiliationID
            ) {
              changeApplicationLiaison(e, true);
            } else {
              if (
                confirm(
                  'The new Liaison has a different Affiliation than the currently assigned Liaison. Are you sure you want to change the Liaison?'
                )
              ) {
                changeApplicationLiaison(e, true);
              }
            }

          } else {
            changeApplicationLiaison(e, true);
          }
        }
      } else {
        changeApplicationLiaison(e, true);
      }
    } else {
      if (profile.id == e.value) {
        changeApplicationLiaison(e, false);
      } else {
        changeApplicationLiaison(e, true);
      }
    }
    if (profile.id != e.value && e.receive_emails) {
      // Send email.
      API.post('Utils', '/utils/liaison/change', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          recipient: e.email,
          given_name: e.first_name,
          service_member: humanName(serviceMember),
          initial_check_in: retrieveFirstCheckin(initialStay),
          final_check_out: retrieveLatestCheckout(staysToCheck()),
          assigning_user: humanName(profile),
          application_id: application.id,
          application_link: window.location.href,
        },
      });
    }
  };

  const changeApplicationLiaison = async (e, shouldChangeToUnread) => {
    let result = null;
    if (e.value.length > 0) {
      result = await API.graphql(graphqlOperation(getUser, { id: e.value }));
    }
    const deserializedResult = result ? deserializeModel(User, result.data.getUser) : null;
    const newApplication = Application.copyOf(application, (updated) => {
      updated.applicationUserId = e.value == '' ? null : e.value;
      updated.liaison_read = shouldChangeToUnread ? READSTATUS.UNREAD : application.liaison_read;
      updated.User = deserializedResult;
      updated.AffiliationID =
        deserializedResult != null ? deserializedResult.AffiliationID : application.AffiliationID;
    });
    const originalLiaison = application.User ? humanName(application.User) : 'Unassigned';
    const noteMessage =
      humanName(profile) +
      ' changed the assigned Liaison from ' +
      originalLiaison +
      ' to ' +
      e.label;
    props.updateApplicationForGroup(newApplication);

    setApplication(newApplication);
    saveApplication(newApplication)
      .then(() => {
        createNote(noteMessage, NOTEACTION.CHANGE_MANAGER, application, profile);
      })
      .then(() => toast('Set Liaison.'));
  };

  const updateApplicationAdmin = (e) => {
    if (profile.id == e.value) {
      changeApplicationAdmin(e, false);
    } else {
      changeApplicationAdmin(e, true);
    }
    if (profile.id != e.value && e.receive_emails) {
      // Send email.
      API.post('Utils', '/utils/admin/change', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          recipient: e.email,
          given_name: e.first_name,
          service_member: humanName(serviceMember),
          initial_check_in: retrieveFirstCheckin(initialStay),
          final_check_out: retrieveLatestCheckout(staysToCheck()),
          assigning_user: humanName(profile),
          application_id: application.id,
          application_link: window.location.href,
        },
      });
    }
  };

  const changeApplicationAdmin = async (e, shouldChangeToUnread) => {
    let result = null;
    if (e.value.length > 0) {
      result = await API.graphql(graphqlOperation(getUser, { id: e.value }));
    }
    const newApplication = Application.copyOf(application, (updated) => {
      updated.applicationAssignedToId = e.value == '' ? null : e.value;
      updated.admin_read = shouldChangeToUnread ? READSTATUS.UNREAD : application.admin_read;
      updated.AssignedTo = result ? deserializeModel(User, result.data.getUser) : null;
    });
    const originalAdmin = application.AssignedTo ? humanName(application.AssignedTo) : 'Unassigned';
    const noteMessage =
      humanName(profile) + ' changed the assigned Admin from ' + originalAdmin + ' to ' + e.label;
    props.updateApplicationForGroup(newApplication);
    setApplication(newApplication);
    saveApplication(newApplication)
      .then(() => {
        createNote(noteMessage, NOTEACTION.CHANGE_ADMIN, application, profile);
      })
      .then(() => toast('Set Admin.'));
  };

  const shouldShowCheckoutReminderBlock = () => {
    if (isLiaison()) {
      return true;
    }
    if (
      (application?.applicationUserId == null || application?.applicationUserId == '') &&
      isAdministrator() &&
      application?.applicationAssignedToId == profile?.id &&
      application?.applicationAssignedToId != null
    ) {
      return true;
    }
    return false;
  };

  if (!profile) return <div></div>;

  return (
    <div className={`sidebar`}>
      <div className={appPaneClassNames}>
        {shouldShowCheckinReminderBlock() && (
          <Fragment>
            <CheckinReminderBlock stays={staysToCheck()} />
          </Fragment>
        )}
        {shouldShowCheckoutReminderBlock() && <CheckoutReminderBlock stays={staysToCheck()} />}
        <form role="form">
          {/* {isAdministrator() && ( */}
          <Fragment>
            <Selectfield
              label="Admin"
              wrapperClass="admin"
              placeholder="Select Admin..."
              getOptions={getAdmins}
              useReactSelect
              inputValue={{
                value: application?.applicationAssignedToId,
                label: application?.applicationAssignedToId
                  ? humanName(application?.AssignedTo)
                  : 'Unassigned',
              }}
              inputOnChange={updateApplicationAdmin}
              isClearable={false}
              inputDisabled={isAdministrator() ? false : true}
              withWrapper={false}
              isSideBar={true}
            />
          </Fragment>
          {/* )} */}

          <Selectfield
            label="Liaison"
            wrapperClass="liaison"
            placeholder="Select Liaison..."
            getOptions={getLiaisons}
            useReactSelect
            inputValue={{
              value: application?.applicationUserId,
              label: application?.applicationUserId ? humanName(application?.User) : 'Unassigned',
            }}
            inputOnChange={updateApplicationLiaison}
            isClearable={false}
            inputDisabled={isLiaison() ? false : !isApplicationEditable(application, true)}
            withWrapper={false}
            isSideBar={true}
          />

          <Selectfield
            label="Group"
            getOptions={getGroups}
            inputValue={{
              value: application?.applicationGroupId,
              label: application?.Group?.name ?? 'None',
            }}
            inputOnChange={updateGroup}
            inputDisabled={!isApplicationEditable(application, true)}
            useReactSelect
            isClearable={false}
            placeholder="Select Group..."
            withWrapper={false}
            isSideBar={true}
          />

          {isAdministrator() && (
            <Fragment>
              <Selectfield
                label="Admin Read / Unread*"
                options={READSTATUS}
                inputRequired={true}
                inputValue={application?.admin_read}
                inputOnChange={updateAdminReadUnread}
                blankValue={false}
                inputDisabled={!isApplicationEditable(application)}
                useReactSelect
                isClearable={false}
                withWrapper={false}
                isSideBar={true}
              />
              <p className="ui-caption">*Select Unread to keep this application in your inbox.</p>
            </Fragment>
          )}
          <Selectfield
            label="Liaison Read / Unread*"
            options={READSTATUS}
            inputRequired={true}
            inputValue={application?.liaison_read}
            inputOnChange={updateReadUnread}
            blankValue={false}
            inputDisabled={!isApplicationEditable(application, true)}
            useReactSelect
            isClearable={false}
            withWrapper={false}
            isSideBar={true}
          />

          <p className="ui-caption">
            *Select Unread to keep this application in the liaison&apos;s inbox.
          </p>
        </form>
      </div>

      <div className={summaryAppPaneClassNames}>
        <LiaisonInformationBlock liaison={application?.User} />
        <ReferrerBlock applicant={applicant} />
        <ServiceMemberBlock member={serviceMember} patient={patient} />
        <PatientInfoBlock
          patient={patient}
          patientIsServiceMember={serviceMember?.other_patient === false}
        />
        <TreatmentFacilityBlock facility={serviceMember?.TreatmentFacility} />
        <GuestBlock applicationId={props.application?.id} />
        <HotelPropertiesBlock initialStay={initialStay} extendedStays={extendedStays} />
      </div>
    </div>
  );
}

LiaisonApplicationSidebar.defaultProps = {
  application: {},
  updateLiaisonReadStatus: () => { },
  shouldShowLoadingIndicator: false,
  removeApplicationFromList: () => { },
  updateApplicationForGroup: () => { },
};
