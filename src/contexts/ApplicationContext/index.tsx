import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Application, Applicant, User, ServiceMember, Stay, Guest, Patient } from '@src/models';
import { AFFILIATIONSTATUS, GUESTTYPE, ROOMTYPE, SERVICEMEMBERSTATUS } from '@src/API';
import { DataStore, API, graphqlOperation } from 'aws-amplify';
import validateRequired from '@utils/validators/required';
import validateEmail from '@utils/validators/email';
import validatePhoneNumber from '@utils/validators/phone';
import validateHotelDate from '@utils/validators/hotelDate';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import {
  createGuest,
  deleteApplication as deleteApplicationMutation,
  deleteGuest as deleteGuestMutation,
  deleteApplicant as deleteApplicantMutation,
  deletePatient as deletePatientMutation,
  deleteServiceMember as deleteServiceMemberMutation,
  deleteStay as deleteStayMutation,
  updateApplicant,
  updateApplication,
  updateGuest,
  updatePatient,
  updateServiceMember,
  updateStay,
} from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';

interface ApplicationContextType {
  application: Application;
  sourceApplication: Application;
  setApplication: (application: Application) => void;
  setSourceApplication: (application: Application) => void;
  applicant: Applicant;
  sourceApplicant: Applicant;
  setApplicant: (applicant: Applicant) => void;
  setSourceApplicant: (applicant: Applicant) => void;
  profile: User;
  sourceProfile: User;
  setProfile: (profile: User) => void;
  setSourceProfile: (profile: User) => void;
  serviceMember: ServiceMember;
  sourceServiceMember: ServiceMember;
  setServiceMember: (serviceMember: ServiceMember) => void;
  setSourceServiceMember: (serviceMember: ServiceMember) => void;
  patient: Patient;
  sourcePatient: Patient;
  setPatient: (patient: Patient) => void;
  setSourcePatient: (patient: Patient) => void;
  primaryGuest: Guest;
  sourcePrimaryGuest: Guest;
  setPrimaryGuest: (guest: Guest) => void;
  setSourcePrimaryGuest: (guest: Guest) => void;
  additionalGuests: Guest[];
  sourceAdditionalGuests: Guest[];
  setAdditionalGuests: (guests: Array<Guest>) => void;
  setSourceAdditionalGuests: (guests: Array<Guest>) => void;
  initialStay: Stay;
  sourceInitialStay: Stay;
  setSourceInitialStay: (stay: Stay) => void;
  extendedStays: [Stay?];
  sourceExtendedStays: [Stay?];
  setExtendedStays: (stay: [Stay?]) => void;
  setSourceExtendedStays: (stays: [Stay?]) => void;
  saveApplication: (app: Application) => Promise<Applicant>;
  saveServiceMember: (member: ServiceMember) => Promise<ServiceMember>;
  savePatient: (patient: Patient) => Promise<Patient>;
  saveApplicant: (app: Applicant) => Promise<Applicant>;
  deleteApplication: () => void;
  deleteApp: () => void;
  deleteInitialStay: () => void;
  deleteGuests: () => void;
  deleteApplicant: () => void;
  deletePatient: () => void;
  deleteServiceMember: () => void;
  deleteStay: (stay: Stay) => void;
  missingLiaisonFields: () => Array<string>;
  missingServiceMemberFields: () => Array<string>;
  missingPatientFields: () => Array<string>;
  missingLodgingFields: () => Array<string>;
  missingAdditionalGuestFields: () => Array<String>;
  missingPrimaryGuestFields: () => Array<string>;
}

const ApplicationContext = createContext<ApplicationContextType>({} as ApplicationContextType);

export function ApplicationProvider({ children }: { children: ReactNode }): JSX.Element {
  const [application, setApplication] = useState<Application>(null);
  const [sourceApplication, setSourceApplication] = useState<Application>(null);
  const [applicant, setApplicant] = useState<Applicant>(null);
  const [sourceApplicant, setSourceApplicant] = useState<Applicant>(null);
  const [profile, setProfile] = useState<User>(null);
  const [sourceProfile, setSourceProfile] = useState<User>(null);
  const [serviceMember, setServiceMember] = useState<ServiceMember>(null);
  const [sourceServiceMember, setSourceServiceMember] = useState<ServiceMember>(null);
  const [patient, setPatient] = useState<Patient>(null);
  const [sourcePatient, setSourcePatient] = useState<Patient>(null);
  const [primaryGuest, setPrimaryGuest] = useState<Guest>(null);
  const [sourcePrimaryGuest, setSourcePrimaryGuest] = useState<Guest>(null);
  const [additionalGuests, setAdditionalGuests] = useState<Guest[]>([]);
  const [sourceAdditionalGuests, setSourceAdditionalGuests] = useState<Guest[]>([]);
  const [initialStay, setInitialStay] = useState<Stay>(null);
  const [sourceInitialStay, setSourceInitialStay] = useState<Stay>(null);
  const [extendedStays, setExtendedStays] = useState<[Stay?]>([]);
  const [sourceExtendedStays, setSourceExtendedStays] = useState<[Stay?]>([]);

  const saveApplication = (app) => {
    if (shouldUseDatastore()) {
      return DataStore.save(app);
    } else {
      return new Promise((resolve, reject) => {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          StaysInApplication,
          User,
          AssignedTo,
          Patient,
          ServiceMember,
          Applicant,
          Group,
          Guests,
          Notes,
          InitialStay,
          ExtendedStays,
          PrimaryGuest,
          AdditionalGuests,
          ...objectToSave
        } = app;
        // @ts-ignore
        API.graphql(
          graphqlOperation(updateApplication, {
            input: {
              ...objectToSave,
              // applicationUserId: app.User?.id,
              // applicationAssignedToId: app.AssignedTo?.id,
              // applicationPatientId: app.Patient?.id,
              // applicationServiceMemberId: app.ServiceMember?.id,
              // applicationApplicantId: app.Applicant?.id,
              // applicationGroupId: app.Group?.id,
            },
          })
        )
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            resolve(deserializeModel(Application, result.data.updateApplication));
          })
          .catch((err) => {
            console.log('Caught Error', err);
            reject(err);
          });
      });
    }
  };

  const saveApplicant = (app) => {
    if (shouldUseDatastore()) {
      return DataStore.save(app);
    } else {
      return new Promise((resolve, reject) => {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, Affiliation, ...objectToSave } =
          app;
        API.graphql(
          graphqlOperation(updateApplicant, {
            input: { ...objectToSave },
          })
        )
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            resolve(deserializeModel(Applicant, result.data.updateApplicant));
          })
          .catch((err) => {
            console.log('Caught error', err);
            reject(err);
          });
      });
    }
  };

  const saveServiceMember = (member) => {
    if (shouldUseDatastore()) {
      return DataStore.save(member);
    } else {
      return new Promise((resolve, reject) => {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          BaseAssignedTo,
          TreatmentFacility,
          ...objectToSave
        } = member;
        if (objectToSave.hasOwnProperty('Application')) {
          delete objectToSave.Application;
        }
        API.graphql(
          graphqlOperation(updateServiceMember, {
            input: {
              ...objectToSave,
            },
          })
        )
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            resolve(deserializeModel(ServiceMember, result.data.updateServiceMember));
          })
          .catch((err) => {
            console.log('Caught error', err);
            reject(err);
          });
      });
    }
  };

  const savePatient = (patient) => {
    if (shouldUseDatastore()) {
      return DataStore.save(patient);
    } else {
      return new Promise((resolve, reject) => {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = patient;
        API.graphql(graphqlOperation(updatePatient, { input: { ...objectToSave } }))
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            resolve(deserializeModel(Patient, result.data.updatePatient));
          })
          .catch((err) => {
            console.log('Caught error', err);
            reject(err);
          });
      });
    }
  };

  const saveGuest = (guest) => {
    if (shouldUseDatastore()) {
      return DataStore.save(guest);
    } else {
      return new Promise((resolve, reject) => {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = guest;
        API.graphql(graphqlOperation(updateGuest, { input: { ...objectToSave } }))
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            resolve(deserializeModel(Guest, result.data.updateGuest));
          })
          .catch((err) => {
            console.log('Caught error', err);
            reject(err);
          });
      });
    }
  };

  const saveStay = (stay) => {
    if (shouldUseDatastore()) {
      return DataStore.save(stay);
    } else {
      return new Promise((resolve, reject) => {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          HotelBooked,
          Application,
          FisherHouse,
          payment_method,
          ...objectToSave
        } = stay;
        API.graphql(
          graphqlOperation(updateStay, {
            input: {
              ...objectToSave,
              // HotelPropertyID: stay.HotelBooked?.id,
              // applicationID: stay.Application?.id,
              // stayFisherHouseId: stay.FisherHouse?.id,
            },
          })
        )
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            resolve(deserializeModel(Stay, result.data.updateStay));
          })
          .catch((err) => {
            console.log('Caught error', err);
            reject(err);
          });
      });
    }
  };

  const deleteInitialStay = async () => {
    if (shouldUseDatastore()) {
      await DataStore.delete(initialStay);
    } else {
      await API.graphql(
        graphqlOperation(deleteStayMutation, {
          input: { id: initialStay.id },
        })
      );
    }
  };

  const deleteApp = async () => {
    if (shouldUseDatastore()) {
      await DataStore.delete(application);
    } else {
      await API.graphql(
        graphqlOperation(deleteApplicationMutation, {
          input: { id: application.id },
        })
      );
    }
  };

  const deleteGuests = async () => {
    if (shouldUseDatastore()) {
      // Unsupported.
    } else {
      await API.graphql(
        graphqlOperation(deleteGuestMutation, {
          input: { id: primaryGuest.id },
        })
      );
      additionalGuests.forEach(async (g) => {
        await API.graphql(
          graphqlOperation(deleteGuestMutation, {
            input: { id: g.id },
          })
        );
      });
    }
  };

  const deleteApplicant = async () => {
    if (shouldUseDatastore()) {
      // Unsupported.
    } else {
      await API.graphql(
        graphqlOperation(deleteApplicantMutation, {
          input: { id: applicant.id },
        })
      );
    }
  };

  const deletePatient = async () => {
    if (shouldUseDatastore()) {
      // Unsupported.
    } else {
      await API.graphql(
        graphqlOperation(deletePatientMutation, {
          input: { id: patient.id },
        })
      );
    }
  };

  const deleteServiceMember = async () => {
    if (shouldUseDatastore()) {
      // Unsupported.
    } else {
      await API.graphql(
        graphqlOperation(deleteServiceMemberMutation, {
          input: { id: serviceMember.id },
        })
      );
    }
  };

  const deleteApplication = async () => {
    await deleteServiceMember();
    await deletePatient();
    await deleteApplicant();
    await deleteGuests();
    await deleteInitialStay();
    await deleteApp();
  };

  const addAdditionalGuest = () => {
    if (shouldUseDatastore()) {
      DataStore.save(
        new Guest({
          applicationID: application.id,
          type: GUESTTYPE.ADDITIONAL,
        })
      ).then((guest) => {
        setAdditionalGuests([...additionalGuests, guest]);
      });
    } else {
      API.graphql(
        graphqlOperation(createGuest, {
          input: { applicationID: application.id, type: GUESTTYPE.ADDITIONAL },
        })
        // @ts-ignore
      ).then((result) => {
        // @ts-ignore
        const deserializedGuest = deserializeModel(Guest, result.data.createGuest);
        setSourceAdditionalGuests([...additionalGuests, deserializedGuest]);
        setAdditionalGuests([...additionalGuests, deserializedGuest]);
      });
    }
  };

  const deleteGuest = (guest) => {
    if (shouldUseDatastore()) {
      return DataStore.delete(guest);
    } else {
      return API.graphql(graphqlOperation(deleteGuestMutation, { input: { id: guest.id } }));
    }
  };

  const deleteStay = (stay) => {
    if (shouldUseDatastore()) {
      // Unsupported.
    } else {
      API.graphql(
        graphqlOperation(deleteStayMutation, {
          input: { id: stay.id },
        })
      );
    }
  };

  const missingLiaisonFields = () => {
    let fields = [];

    if (
      typeof applicant?.collected_outside_fisherhouse == 'undefined' ||
      applicant?.collected_outside_fisherhouse == null
    ) {
      fields.push('Information Collector');
    } else if (applicant?.collected_outside_fisherhouse) {
      if (!validateRequired(applicant?.first_name).valid) {
        fields.push('First Name');
      }
      if (!validateRequired(applicant?.last_name).valid) {
        fields.push('Last Name');
      }
      if (!validateRequired(applicant?.job).valid) {
        fields.push('Job Title');
      }
      if (!validateRequired(applicant?.email).valid || !validateEmail(applicant?.email).valid) {
        fields.push('Email');
      }
      if (
        applicant?.telephone &&
        applicant.telephone.length > 3 &&
        !validatePhoneNumber(applicant?.telephone).valid
      ) {
        fields.push('Telephone');
      }
      if (applicant?.affiliation_type == null) {
        fields.push('Affiliation Type');
      }
      if (!validateRequired(applicant?.applicantAffiliationId).valid) {
        fields.push('Affiliation');
      }
      if (
        applicant?.Affiliation?.status == AFFILIATIONSTATUS.DRAFT ||
        applicant?.Affiliation?.status == AFFILIATIONSTATUS.PENDING
      ) {
        if (!validateRequired(applicant?.Affiliation?.name).valid) {
          fields.push('Suggested Affiliation Name');
        }
        if (!validateRequired(applicant?.Affiliation?.city).valid) {
          fields.push('Suggested Affiliation City');
        }
        if (!validateRequired(applicant?.Affiliation?.state).valid) {
          fields.push('Suggested Affiliation State');
        }
      }
    }

    return fields;
  };

  const missingServiceMemberFields = () => {
    let fields = [];

    if (
      typeof serviceMember?.first_name == 'undefined' ||
      !validateRequired(serviceMember?.first_name).valid
    ) {
      fields.push('First Name');
    }
    if (
      typeof serviceMember?.last_name == 'undefined' ||
      !validateRequired(serviceMember?.last_name).valid
    ) {
      fields.push('Last Name');
    }
    // if (typeof serviceMember?.email == 'undefined' || !validateEmail(serviceMember?.email).valid) {
    //   fields.push('Email');
    // }
    if (
      typeof serviceMember?.telephone == 'undefined' ||
      !validatePhoneNumber(serviceMember?.telephone).valid
    ) {
      fields.push('Telephone');
    }
    if (
      typeof serviceMember?.branch_of_service == 'undefined' ||
      !validateRequired(serviceMember?.branch_of_service).valid
    ) {
      fields.push('Branch of Service');
    }
    if (
      typeof serviceMember?.current_status == 'undefined' ||
      !validateRequired(serviceMember?.current_status).valid
    ) {
      fields.push('Current Status');
    }
    if (serviceMember?.current_status != SERVICEMEMBERSTATUS.VETERAN) {
      if (
        typeof serviceMember?.serviceMemberBaseAssignedToId == 'undefined' ||
        !validateRequired(serviceMember?.serviceMemberBaseAssignedToId).valid
      ) {
        fields.push('Base Assigned To');
      }
    } else if (serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN) {
      if (
        typeof serviceMember?.serviceMemberBaseAssignedToId == 'undefined' ||
        !validateRequired(serviceMember?.serviceMemberBaseAssignedToId).valid
      ) {
        fields.push('VA Assigned To');
      }
    }
    if (
      typeof serviceMember?.on_military_travel_orders == 'undefined' ||
      serviceMember?.on_military_travel_orders == null
    ) {
      fields.push('On Military Travel Orders');
    }
    if (
      typeof serviceMember?.other_patient == 'undefined' ||
      serviceMember?.other_patient == null
    ) {
      fields.push('Patient Information');
    }
    if (
      typeof serviceMember?.serviceMemberTreatmentFacilityId == 'undefined' ||
      !validateRequired(serviceMember?.serviceMemberTreatmentFacilityId).valid
    ) {
      fields.push('Treatment Facility');
    }
    if (
      serviceMember?.TreatmentFacility?.status == AFFILIATIONSTATUS.DRAFT ||
      serviceMember?.TreatmentFacility?.status == AFFILIATIONSTATUS.PENDING
    ) {
      if (!validateRequired(serviceMember?.TreatmentFacility?.name).valid) {
        fields.push('Suggested Treatment Facility Name');
      }
      if (!validateRequired(serviceMember?.TreatmentFacility?.city).valid) {
        fields.push('Suggested Treatment Facility City');
      }
      if (!validateRequired(serviceMember?.TreatmentFacility?.state).valid) {
        fields.push('Suggested Treatment Facility State');
      }
    }

    return fields;
  };

  const missingPatientFields = () => {
    let fields = [];

    if (serviceMember?.other_patient) {
      if (
        typeof patient?.first_name == 'undefined' ||
        !validateRequired(patient?.first_name).valid
      ) {
        fields.push('Patient First Name');
      }
      if (typeof patient?.last_name == 'undefined' || !validateRequired(patient?.last_name).valid) {
        fields.push('Patient Last Name');
      }
      if (
        typeof patient?.relationship == 'undefined' ||
        !validateRequired(patient?.relationship).valid
      ) {
        fields.push('Patient Relationship');
      }
    }

    return fields;
  };

  const missingLodgingFields = () => {
    let fields = [];

    if (
      typeof initialStay?.requested_check_in == 'undefined' ||
      !validateRequired(initialStay?.requested_check_in).valid ||
      !validateHotelDate(initialStay?.requested_check_in).valid
    ) {
      fields.push('Requested Check-in Date');
    }
    if (
      typeof initialStay?.requested_check_out == 'undefined' ||
      !validateRequired(initialStay?.requested_check_out).valid ||
      !validateHotelDate(initialStay?.requested_check_out).valid
    ) {
      fields.push('Requested Check-out Date');
    }
    if (
      typeof initialStay?.room_type_requests == 'undefined' ||
      !validateRequired(initialStay?.room_type_requests).valid
    ) {
      fields.push('Room Type');
    }
    if (
      initialStay?.room_type_requests == ROOMTYPE.OTHER &&
      !validateRequired(initialStay?.room_description).valid
    ) {
      fields.push('Room Description');
    }
    if (
      typeof initialStay?.narrative == 'undefined' ||
      !validateRequired(initialStay?.narrative).valid
    ) {
      fields.push('Narrative');
    }

    // Primary guest information
    fields = fields.concat(missingPrimaryGuestFields());

    fields = fields.concat(missingAdditionalGuestFields());

    return fields;
  };

  const missingPrimaryGuestFields = () => {
    let fields = [];

    if (
      typeof primaryGuest?.first_name == 'undefined' ||
      !validateRequired(primaryGuest?.first_name).valid
    ) {
      fields.push('Primary Guest First Name');
    }
    if (
      typeof primaryGuest?.last_name == 'undefined' ||
      !validateRequired(primaryGuest?.last_name).valid
    ) {
      fields.push('Primary Guest Last Name');
    }
    // if (typeof primaryGuest?.email == 'undefined' || !validateEmail(primaryGuest?.email).valid) {
    //   fields.push('Primary Guest Email');
    // }
    if (
      typeof primaryGuest?.telephone == 'undefined' ||
      !validatePhoneNumber(primaryGuest?.telephone).valid
    ) {
      fields.push('Primary Guest Telephone');
    }
    if (
      typeof primaryGuest?.address == 'undefined' ||
      !validateRequired(primaryGuest?.address).valid
    ) {
      fields.push('Primary Guest Address');
    }
    if (typeof primaryGuest?.city == 'undefined' || !validateRequired(primaryGuest?.city).valid) {
      fields.push('Primary Guest City');
    }
    if (typeof primaryGuest?.state == 'undefined' || !validateRequired(primaryGuest?.state).valid) {
      fields.push('Primary Guest State');
    }
    if (
      typeof primaryGuest?.relationship == 'undefined' ||
      !validateRequired(primaryGuest?.relationship).valid
    ) {
      fields.push('Primary Guest Relationship to Service Member');
    }

    return fields;
  };

  const missingAdditionalGuestFields = () => {
    let fields = [];

    additionalGuests.forEach((guest) => {
      if (typeof guest?.first_name == 'undefined' || !validateRequired(guest?.first_name).valid) {
        fields.push('Additional Guest First Name');
      }
      if (typeof guest?.last_name == 'undefined' || !validateRequired(guest?.last_name).valid) {
        fields.push('Additional Guest Last Name');
      }
    });

    return fields;
  };

  const memoedValue = useMemo(
    () => ({
      application,
      setApplication,
      applicant,
      setApplicant,
      profile,
      setProfile,
      serviceMember,
      setServiceMember,
      patient,
      setPatient,
      primaryGuest,
      setPrimaryGuest,
      additionalGuests,
      setAdditionalGuests,
      initialStay,
      setInitialStay,
      saveApplication,
      saveApplicant,
      saveServiceMember,
      savePatient,
      saveStay,
      saveGuest,
      deleteGuest,
      addAdditionalGuest,
      missingLiaisonFields,
      missingServiceMemberFields,
      missingPatientFields,
      missingLodgingFields,
      missingAdditionalGuestFields,
      missingPrimaryGuestFields,
      deleteApplication,
      deleteInitialStay,
      deleteApp,
      deleteGuests,
      deletePatient,
      deleteApplicant,
      deleteServiceMember,
      deleteStay,
      sourceApplication,
      setSourceApplication,
      sourceApplicant,
      setSourceApplicant,
      sourceProfile,
      setSourceProfile,
      sourceServiceMember,
      setSourceServiceMember,
      sourcePatient,
      setSourcePatient,
      sourcePrimaryGuest,
      setSourcePrimaryGuest,
      sourceAdditionalGuests,
      setSourceAdditionalGuests,
      sourceInitialStay,
      setSourceInitialStay,
      extendedStays,
      setExtendedStays,
      sourceExtendedStays,
      setSourceExtendedStays,
    }),
    [
      application,
      applicant,
      profile,
      serviceMember,
      patient,
      primaryGuest,
      additionalGuests,
      initialStay,
      sourceApplication,
      sourceApplicant,
      sourceProfile,
      sourceServiceMember,
      sourcePatient,
      sourcePrimaryGuest,
      sourceAdditionalGuests,
      sourceInitialStay,
      extendedStays,
      sourceExtendedStays,
    ]
  );

  return <ApplicationContext.Provider value={memoedValue}>{children}</ApplicationContext.Provider>;
}

export default function useApplicationContext() {
  return useContext(ApplicationContext);
}
