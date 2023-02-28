import React, { useCallback, useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import AdminPdf from '@components/PDFs/admin';
import useApplicationContext from '@contexts/ApplicationContext';
import {
  READSTATUS,
  NOTEACTION,
  USERSTATUS,
  STAYTYPE,
  GUESTTYPE,
  STAYSTATUS,
  APPLICATIONSTATUS,
} from '@src/API';
import { DataStore } from '@aws-amplify/datastore';
import { Application, ServiceMember, Stay, Guest, Patient, Applicant, User } from '@src/models';
import toast from 'react-hot-toast';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getApplication } from '@src/customQueries/getApplicationWithDependencies';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';

export default function AdminApplicationPdf(props) {
  const router = useRouter();
  const { uuid } = router.query;
  const { user, profile } = useAuth();
  const { setMessage } = useDialog();
  const {
    application,
    applicant,
    initialStay,
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
          router.replace('/');
          return;
        }
        const application = deserializeModel(Application, applicationResult.data.getApplication);
        setApplication(application);
        setSourceApplication(application);
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

  const { loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  } else if (!isAdministrator()) {
    router.push('/');
    return null;
  }

  return (
    <PDFViewer width={window.innerWidth} height={window.innerHeight}>
      <AdminPdf application={application} applicant={applicant} initialStay={initialStay} />
    </PDFViewer>
  );
}
