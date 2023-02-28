import useAuth from '@contexts/AuthContext';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import FisherhouseHeader from '@components/FisherhouseHeader';
import config from '../../../site.config';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import GroupOmnibar from '@components/GroupOmnibar';
import ApplicationHeader from '@components/ApplicationHeader';
import ApplicationMainColumn from '@components/ApplicationMainColumn';
import { tabs } from '@utils/tabNames';
import classNames from 'classnames';
import GroupSidebar from '@components/GroupSidebar';
import { DataStore } from '@aws-amplify/datastore';
import {
  Application,
  ServiceMember,
  Stay,
  Guest,
  Group,
  Applicant,
  Patient,
  User,
} from '@src/models';
import { STAYTYPE, STAYSTATUS, GUESTTYPE } from '@src/API';
import useApplicationContext from '@contexts/ApplicationContext';
import useDialog from '@contexts/DialogContext';
import GroupMainColumn from '../../../src/components/GroupMainColumn';
import ApplicationSidebar from '@components/ApplicationSidebar';
import GroupChangeDialog from '../../../src/components/GroupChangeDialog';
import useGroupDialog from '@contexts/GroupDialogContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getGroup, listApplications, listStays, listGuests } from '@src/graphql/queries';
import { applicationByGroupId } from '@src/customQueries/listApplicationsByGroupWithDependencies';
import { getApplication } from '@src/customQueries/getApplicationWithDependencies';
import { createServiceMember, createStay, createGuest } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function GroupApplicationPage() {
  const router = useRouter();
  const { user, profile, loadingInitial, isAuthenticated, isAdministrator } = useAuth();
  const { message, clearMessage, setMessage, isNoApplications } = useDialog();
  const groupwideActionsValue = 'Groupwide Actions';
  const [currentApplication, setCurrentApplication] = useState(groupwideActionsValue);
  const [currentTab, setCurrentTab] = useState(1);
  const [group, setGroup] = useState({});
  const [availableApplications, setAvailableApplications] = useState([]);
  const [loadingTransitionActive, setLoadingTransitionActive] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [deletionApplication, setDeletionApplication] = useState(false);
  const baseInputDefaultState = {
    page1: {
      first_name: '',
      middle_initial: '',
      last_name: '',
      job_title: '',
      email: '',
      telephone: '',
      extension: '',
      affiliation_type: '',
      affiliation: '',
    },
    page2: {},
    page3: {},
  };

  const {
    shouldShowGroupChange,
    setShouldShowGroupChange,
    setApplyChangesFunction,
    applyChangesFunction,
    cancelFunction,
    isAffiliationChange,
    AffiliationID,
  } = useGroupDialog();

  const { isWaiting, setIsWaiting } = useButtonWait();

  const loadGroupApplications = useCallback(
    (uuid) => {
      if (!profile?.AffiliationID) {
        return;
      }
      if (shouldUseDatastore()) {
        DataStore.query(Application, (a) => a.applicationGroupId('eq', uuid)).then((results) => {
          if (results.length > 0) {
            setAvailableApplications(results);
          } else {
            setMessage('There was no applications or group found.');
          }
        });
      } else {
        setLoadingCounter((prev) => prev + 1);
        let filters = {
          applicationGroupId: uuid,
          limit: 1000,
        };
        if (!isAdministrator()) {
          filters.filter = {
            AffiliationID: { eq: profile?.AffiliationID },
          };
        }
        setTimeout(() => {
          API.graphql(graphqlOperation(applicationByGroupId, filters))
            .then((results) => {
              if (results.data.ApplicationByGroupId.items.length > 0) {
                setAvailableApplications(
                  results.data.ApplicationByGroupId.items
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((item) =>
                      deserializeModel(Application, item)
                    )
                );
              } else {
                setAvailableApplications([]);
                // clearMessage();
                // setTimeout(() => {
                //   setMessage('There are no applications in this group.');
                // }, 1000);
              }
              setLoadingCounter((prev) => prev - 1);
            })
            .catch(() => {
              setLoadingCounter((prev) => prev - 1);
            });
        }, 500);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile?.AffiliationID]
  );

  useEffect(() => {
    if (isNoApplications) {
      setTimeout(() => {
        setMessage('There are no applications in this group.');
      }, 1000);
    }
  }, [isNoApplications]);

  useEffect(() => {
    if (!isWaiting) {
      if (shouldUseDatastore()) {
        DataStore.query(Group, router.query.uuid).then((results) => {
          setGroup(results);
        });
      } else {
        if (router.query.uuid) {
          setLoadingCounter((prev) => prev + 1);
          setHasLoaded(true);
          API.graphql(graphqlOperation(getGroup, { id: router.query.uuid }))
            .then((result) => {
              if (result.data.getGroup != null) {
                setGroup(result.data.getGroup);
                loadGroupApplications(router.query.uuid);
                setLoadingCounter((prev) => prev - 1);
              } else {
                router.replace('/');
              }
              setDeletionApplication(false);
            })
            .catch(() => {
              setLoadingCounter((prev) => prev - 1);
              setDeletionApplication(false);
            });
        }
      }
    }
  }, [router.query.uuid, router, loadGroupApplications, isWaiting, deletionApplication]);

  const contentColumnsClasses = classNames('content-columns', {
    three: currentTab == 4,
  });

  const {
    saveApplication,
    setApplication,
    setServiceMember,
    setApplicant,
    setProfile,
    setPatient,
    setPrimaryGuest,
    setInitialStay,
    setAdditionalGuests,
    setSourceApplication,
    setSourceServiceMember,
    setSourceApplicant,
    setSourceProfile,
    setSourcePatient,
    setSourcePrimaryGuest,
    setSourceInitialStay,
    setSourceAdditionalGuests,
  } = useApplicationContext();

  const loadApplication = async (uuid) => {
    setLoadingTransitionActive(true);
    if (shouldUseDatastore()) {
      const application = await DataStore.query(Application, uuid);

      // @TODO -- error handling if the lookup fails.
      setApplication(application);
      if (application?.ServiceMember != null) {
        setServiceMember(application.ServiceMember);
      } else {
        DataStore.save(
          new ServiceMember({
            applicationID: uuid,
          })
        ).then((member) => {
          saveApplication(
            Application.copyOf(application, (updated) => {
              updated.ServiceMember = member;
            })
          ).then((app) => {
            setApplication(app);
          });
          setServiceMember(member);
        });
      }
      if (application?.Applicant != null) {
        setApplicant(application.Applicant);
      }
      if (application?.User != null) {
        setProfile(application.User);
      }
      DataStore.query(Stay, (c) => c.applicationID('eq', uuid).type('eq', STAYTYPE.INITIAL), {
        limit: 1,
      }).then((stay) => {
        if (stay.length == 0) {
          DataStore.save(
            new Stay({
              type: STAYTYPE.INITIAL,
              applicationID: uuid,
              status: STAYSTATUS.DRAFT,
            })
          ).then((stay) => {
            setInitialStay(stay);
          });
        } else {
          setInitialStay(stay[0]);
        }
      });
      DataStore.query(Guest, (c) => c.applicationID('eq', uuid).type('eq', GUESTTYPE.PRIMARY)).then(
        (guests) => {
          if (guests.length > 0) {
            setPrimaryGuest(guests[0]);
          } else {
            DataStore.save(
              new Guest({
                applicationID: uuid,
                type: GUESTTYPE.PRIMARY,
              })
            ).then((guest) => {
              setPrimaryGuest(guest);
            });
          }
        }
      );
      DataStore.query(Guest, (c) =>
        c.applicationID('eq', uuid).type('eq', GUESTTYPE.ADDITIONAL)
      ).then((guests) => {
        setAdditionalGuests(guests);
      });
    } else {
      const applicationResult = await API.graphql(graphqlOperation(getApplication, { id: uuid }));
      if (applicationResult.data.getApplication == null) {
        router.replace('/');
        return;
      }
      const application = deserializeModel(Application, applicationResult.data.getApplication);
      setApplication(application);
      setSourceApplication(application);
      if (application?.ServiceMember != null) {
        const deserializedSM = deserializeModel(ServiceMember, application.ServiceMember);
        setServiceMember(deserializedSM);
        setSourceServiceMember(deserializedSM);
      }
      if (application?.Applicant != null) {
        const deserializedApplicant = deserializeModel(Applicant, application.Applicant);
        setApplicant(deserializedApplicant);
        setSourceApplicant(deserializedApplicant);
      }
      if (application?.User != null) {
        const deserializedProfile = deserializeModel(User, application.User);
        setProfile(deserializedProfile);
        setSourceProfile(deserializedProfile);
      }
      if (application?.Patient != null) {
        const deserializedPatient = deserializeModel(Patient, application.Patient);
        setPatient(deserializedPatient);
        setSourcePatient(deserializedPatient);
      }
      if (application.InitialStay.items.length > 0) {
        const deserializedInitialStay = deserializeModel(Stay, application.InitialStay.items[0]);
        setInitialStay(deserializedInitialStay);
        setSourceInitialStay(deserializedInitialStay);
      }
      if (application.PrimaryGuest.items.length > 0) {
        const deserializedPrimaryGuest = deserializeModel(Guest, application.PrimaryGuest.items[0]);
        setPrimaryGuest(deserializedPrimaryGuest);
        setSourcePrimaryGuest(deserializedPrimaryGuest);
      }
      if (application.AdditionalGuests.items.length > 0) {
        const deserializedAdditionalGuests = application.AdditionalGuests.items.map((item) =>
          deserializeModel(Guest, item)
        );
        setAdditionalGuests(deserializedAdditionalGuests);
        setSourceAdditionalGuests(deserializedAdditionalGuests);
      } else {
        setAdditionalGuests([]);
        setSourceAdditionalGuests([]);
      }
    }
    setLoadingTransitionActive(false);
  };

  const changeCurrentApplication = (value) => {
    // We need to set the appropriate context if this is an individual app.
    if (value != groupwideActionsValue) {
      loadApplication(value);
    } else {
      if (currentTab == 4) {
        setCurrentTab(1);
      }
    }
    setCurrentApplication(value);
  };

  const removeApplicationFromList = (application_id) => {
    setTimeout(() => {
      const applications = availableApplications.filter((item) => item.id != application_id);
      setAvailableApplications(applications);
      setCurrentApplication(groupwideActionsValue);
      setDeletionApplication(true);
      if (currentTab == 4) {
        setCurrentTab(1);
      }
    }, 500);
  };

  const updateApplicationForGroup = (new_application) => {
    setAvailableApplications((prev) =>
      prev.map((item) => {
        if (item.id == new_application.id) {
          return new_application;
        } else {
          return item;
        }
      })
    );
  };

  const mainContentClasses = classNames('main-content', {
    loading: loadingCounter > 0 || !hasLoaded,
  });

  const applyGroupChangeDialog = () => {
    applyChangesFunction();

    if (router.query.uuid) {
      loadGroupApplications(router.query.uuid);
    }
  };

  const cancelGroupChangeDialog = () => {
    cancelFunction();
    setShouldShowGroupChange(false);
  };

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  } else if (!isAdministrator()) {
    // 10-12-22 -- Both administrators and liaisons can access groups.
    // Only administrators should be able to access system paths.
    // router.replace('/');
    // return null;
  }

  return (
    <Fragment>
      {shouldShowGroupChange && (
        <GroupChangeDialog
          applyChange={applyGroupChangeDialog}
          close={() => setShouldShowGroupChange(false)}
          cancel={cancelGroupChangeDialog}
          numberLiaisonAssigned={
            availableApplications.filter(
              (item) =>
                ((item.applicationUserId !== '' && item.applicationUserId !== null) ||
                  item?.AffiliationID) &&
                item?.AffiliationID !== AffiliationID
            ).length
          }
          numberApplicationsImpacted={availableApplications.length}
          isAffiliationChange={isAffiliationChange}
        />
      )}
      <div className="page-container">
        <FisherhouseHeader title={config.title} description={config.description} />

        <PageHeader />

        <IntroBlock />

        <section className={mainContentClasses}>
          <div className="container">
            <GroupOmnibar
              currentTab={currentTab}
              changeTab={setCurrentTab}
              applications={availableApplications}
              groupNameValue={currentApplication}
              setGroupNameValue={changeCurrentApplication}
              groupwideActionsValue={groupwideActionsValue}
              title={group?.name}
              updateGroupLoading={setLoadingTransitionActive}
            />

            <ApplicationHeader
              partNumber={currentTab}
              partName={tabs[currentTab]}
              shouldIncludeServiceMemberName={false}
            />

            <div className={contentColumnsClasses}>
              {currentApplication != groupwideActionsValue && (
                <ApplicationSidebar
                  application={currentApplication}
                  shouldShowLoadingIndicator={loadingTransitionActive}
                  removeApplicationFromList={removeApplicationFromList}
                  updateApplicationForGroup={updateApplicationForGroup}
                />
              )}
              {currentApplication == groupwideActionsValue && (
                <GroupSidebar
                  // application={application}
                  // updateLiaisonReadStatus={updateLiaisonReadStatus}
                  shouldShowLoadingIndicator={loadingTransitionActive}
                  applications={availableApplications}
                  groupId={group.id}
                  removeApplicationFromList={removeApplicationFromList}
                />
              )}

              {currentApplication != groupwideActionsValue && (
                <ApplicationMainColumn
                  application={availableApplications.find((item) => item.id === currentApplication)}
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  shouldShowLoadingIndicator={loadingTransitionActive}
                  removeApplicationFromList={removeApplicationFromList}
                  updateApplicationForGroup={updateApplicationForGroup}
                  fromGroupView
                />
              )}

              {currentApplication == groupwideActionsValue && (
                <GroupMainColumn
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  applications={availableApplications}
                  setApplications={setAvailableApplications}
                  shouldShowLoadingIndicator={loadingTransitionActive}
                  maxPages={currentApplication == groupwideActionsValue ? 3 : 4}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
