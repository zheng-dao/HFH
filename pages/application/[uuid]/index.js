import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import useApplicationContext from '@contexts/ApplicationContext';
import { useRouter } from 'next/router';
import FisherhouseHeader from '@components/FisherhouseHeader';
import config from '../../../site.config';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@src/components/IntroBlock';
import { useCallback, useEffect, useState } from 'react';
import Omnibar from '@src/components/Omnibar';
import {
  READSTATUS,
  NOTEACTION,
  USERSTATUS,
  STAYTYPE,
  GUESTTYPE,
  STAYSTATUS,
  APPLICATIONSTATUS,
} from '@src/API';
import ApplicationHeader from '@components/ApplicationHeader';
import { tabs } from '@utils/tabNames';
import ApplicationSidebar from '@components/ApplicationSidebar';
import ApplicationMainColumn from '@components/ApplicationMainColumn';
import classNames from 'classnames';
import { DataStore } from '@aws-amplify/datastore';
import { Application, ServiceMember, Stay, Guest, Patient, Applicant, User } from '@src/models';
import toast from 'react-hot-toast';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getGroup, listApplications, listStays, listGuests } from '@src/graphql/queries';
import { getApplication } from '@src/customQueries/getApplicationWithDependencies';
import {
  createServiceMember,
  createStay,
  createGuest,
  updateApplication,
  createPatient,
} from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import humanName from '@utils/humanName';
import createNote from '@utils/createNote';
import { Logger } from 'aws-amplify';

export default function IndividualApplication() {
  const router = useRouter();
  const { user, profile, loadingInitial, isAuthenticated, isAdministrator, isLiaison } = useAuth();
  const [currentTab, setCurrentTab] = useState(1);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isReadyForApplicationSave, setIsReadyForApplicationSave] = useState(false);
  const [
    shouldShowErrorMessagesFromSubmitValidation,
    setShouldShowErrorMessagesFromSubmitValidation,
  ] = useState(false);

  const { setMessage } = useDialog();
  const {
    application,
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
    setExtendedStays,
    setSourceExtendedStays,
  } = useApplicationContext();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);

  const { uuid } = router.query;

  useEffect(() => {
    if (user != null && profile != null) {
      switch (profile.status) {
        case USERSTATUS.DRAFT:
          setMessage(
            'Your profile requires approval before you can continue. Please complete your profile and submit it for review.'
          );
          router.push('/profile');
          break;

        case USERSTATUS.PENDING:
          setMessage('Your profile is awaiting approval. Please check back later.');
          router.push('/profile');
          break;

        case USERSTATUS.ARCHIVED:
          setMessage('Your profile has expired. Please contact us for further instructions.');
          router.push('/profile');
          break;

        case USERSTATUS.INACTIVE:
          setCurrentProfile(profile);
          break;
      }
    }
  }, [user, profile, router, setMessage]);

  const loadApplication = useCallback(
    async (uuid) => {
      if (shouldUseDatastore()) {
        const application = await DataStore.query(Application, uuid);

        // @TODO -- error handling if the lookup fails.
        setApplication(application);
        setSourceApplication(application);
        if (application?.ServiceMember != null) {
          setServiceMember(application.ServiceMember);
          setSourceServiceMember(application.ServiceMember);
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
          setSourceApplicant(application.Applicant);
        }
        if (application?.User != null) {
          setProfile(application.User);
          setSourceProfile(application.User);
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
        DataStore.query(Guest, (c) =>
          c.applicationID('eq', uuid).type('eq', GUESTTYPE.PRIMARY)
        ).then((guests) => {
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
        });
        DataStore.query(Guest, (c) =>
          c.applicationID('eq', uuid).type('eq', GUESTTYPE.ADDITIONAL)
        ).then((guests) => {
          setAdditionalGuests(guests);
        });
      } else {
        setLoadingCounter((prev) => prev + 1);
        const applicationResult = await API.graphql(graphqlOperation(getApplication, { id: uuid }));
        if (applicationResult.data.getApplication == null) {
          new Logger('fisherhouse-hotels').warn(
            'Redirecting to homepage because of non-existent application.'
          );
          router.replace('/');
          return;
        }
        const application = deserializeModel(Application, applicationResult.data.getApplication);
        setApplication(application);
        setSourceApplication(application);
        if (isLiaison()) {
          if (application?.User?.AffiliationID != profile?.AffiliationID) {
            new Logger('fisherhouse-hotels').warn(
              'Redirecting to homepage because of affiliation mis-match.'
            );
            router.replace('/');
            return;
          }
        }
        if (isAdministrator()) {
          if (application?.id != null && application?.id != '') {
            if (
              application?.applicationAssignedToId == null ||
              application?.applicationAssignedToId == ''
            ) {
              const newApplication = Application.copyOf(application, (updated) => {
                updated.applicationAssignedToId = profile.id;
                updated.admin_read = READSTATUS.UNREAD;
                updated.AssignedTo = profile;
              });
              const originalAdmin = 'Unassigned';
              const noteMessage =
                humanName(profile) +
                ' changed the assigned Admin from ' +
                originalAdmin +
                ' to ' +
                humanName(profile);
              setApplication(newApplication);
              saveApplication(newApplication)
                .then(() => {
                  createNote(noteMessage, NOTEACTION.CHANGE_ADMIN, application, profile);
                })
                .then(() => toast('Set Admin.'));
            }
          }
        }
        if (application?.ServiceMember != null) {
          const deserializedSM = deserializeModel(ServiceMember, application.ServiceMember);
          setServiceMember(deserializedSM);
          setSourceServiceMember(deserializedSM);
        } else {
          setMessage(
            'There is a problem with this application which has rendered it unavailable. If you continue to receive this message, please contact us and reference ID ' +
            application.id
          );
        }
        if (application?.Applicant != null) {
          const deserializedApplicant = deserializeModel(Applicant, application.Applicant);
          setApplicant(deserializedApplicant);
          setSourceApplicant(deserializedApplicant);
        } else {
          setMessage(
            'There is a problem with this application which has rendered it unavailable. If you continue to receive this message, please contact us and reference ID ' +
            application.id
          );
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
        } else {
          setMessage(
            'There is a problem with this application which has rendered it unavailable. If you continue to receive this message, please contact us and reference ID ' +
            application.id
          );
        }
        if (application.InitialStay.items.length > 0) {
          const deserializedInitialStay = deserializeModel(Stay, application.InitialStay.items[0]);
          setInitialStay(deserializedInitialStay);
          setSourceInitialStay(deserializedInitialStay);
        } else {
          setMessage(
            'There is a problem with this application which has rendered it unavailable. If you continue to receive this message, please contact us and reference ID ' +
            application.id
          );
        }
        if (application.ExtendedStays.items.length > 0) {
          const deserializedExtendedStays = application.ExtendedStays.items.map((item) =>
            deserializeModel(Stay, item)
          );
          setExtendedStays(deserializedExtendedStays);
          setSourceExtendedStays(deserializedExtendedStays);
        } else {
          setExtendedStays([]);
          setSourceExtendedStays([]);
        }
        if (application.PrimaryGuest.items.length > 0) {
          const deserializedPrimaryGuest = deserializeModel(
            Guest,
            application.PrimaryGuest.items[0]
          );
          setPrimaryGuest(deserializedPrimaryGuest);
          setSourcePrimaryGuest(deserializedPrimaryGuest);
        } else {
          setMessage(
            'There is a problem with this application which has rendered it unavailable. If you continue to receive this message, please contact us and reference ID ' +
            application.id
          );
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
        setLoadingCounter((prev) => prev - 1);
      }
    },
    // eslint-disable-next-line
    [
      setSourceAdditionalGuests,
      setSourceApplicant,
      setSourceApplication,
      setSourceInitialStay,
      setSourcePatient,
      setSourcePrimaryGuest,
      setSourceProfile,
      setSourceServiceMember,
      setAdditionalGuests,
      setApplicant,
      setApplication,
      setInitialStay,
      setPrimaryGuest,
      setProfile,
      setServiceMember,
      saveApplication,
      setPatient,
      router,
      setMessage,
      setExtendedStays,
      setSourceExtendedStays,
      // isAdministrator,
      profile,
    ]
  );

  useEffect(() => {
    if (uuid != null && profile != null) {
      setHasLoaded(false);
      loadApplication(uuid);
      setHasLoaded(true);
    }
    // eslint-disable-next-line
  }, [uuid, profile]);

  useEffect(() => {
    if (isAdministrator()) {
      if (application?.status != APPLICATIONSTATUS.DRAFT && application?.status != null) {
        setCurrentTab(4);
      } else {
        setCurrentTab(1);
      }
    }
  }, [application?.status, isAdministrator]);

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  }

  const contentColumnsClasses = classNames('content-columns', {
    three: currentTab == 4,
  });

  const updateLiaisonReadStatus = (e) => {
    if (shouldUseDatastore()) {
      DataStore.save(
        Application.copyOf(application, (updated) => {
          updated.liaison_read = e.target.value;
        })
      )
        .then((application) => {
          setApplication(application);
        })
        .then(() => {
          toast('Saved Read/Unread status.');
        });
    } else {
      API.graphql(
        graphqlOperation(updateApplication, {
          input: { id: application.id, liaison_read: e.target.value },
        })
      )
        .then((results) => {
          setApplication(deserializeModel(Application, results.data.updateApplication));
        })
        .then(() => {
          toast('Saved Read/Unread status.');
        });
    }
  };

  if (true || currentProfile != null) {
    return (
      <div className="page-container">
        <FisherhouseHeader title={config.title} description={config.description} />

        <PageHeader />

        <IntroBlock />

        <section className="main-content">
          <div className="container">
            <Omnibar
              currentTab={currentTab}
              changeTab={setCurrentTab}
              shouldShowLoadingIndicator={!hasLoaded || loadingCounter > 0}
            />

            <ApplicationHeader partNumber={currentTab} partName={tabs[currentTab]} />

            <div className={contentColumnsClasses}>
              <ApplicationSidebar
                application={application}
                updateLiaisonReadStatus={updateLiaisonReadStatus}
                shouldShowLoadingIndicator={!hasLoaded || loadingCounter > 0}
              />

              <ApplicationMainColumn
                currentTab={currentTab}
                application={application}
                updateApplication={setApplication}
                setCurrentTab={setCurrentTab}
                shouldShowLoadingIndicator={!hasLoaded || loadingCounter > 0}
                shouldShowErrorMessagesFromSubmitValidation={
                  shouldShowErrorMessagesFromSubmitValidation
                }
                setShouldShowErrorMessagesFromSubmitValidation={
                  setShouldShowErrorMessagesFromSubmitValidation
                }
              />
            </div>
          </div>
        </section>
      </div>
    );
  } else {
    return null;
  }
}
