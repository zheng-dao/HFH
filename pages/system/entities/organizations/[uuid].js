import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Affiliation, Stay, ServiceMember, HotelProperty, Applicant, User } from '@src/models';
import { AFFILIATIONSTATUS, BRANCHESOFSERVICE } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import StateField from '@components/CommonInputs/StateField';
import { State } from '@utils/states';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  getAffiliation,
  searchAffiliations,
  searchStays,
  searchServiceMembers,
  searchHotelProperties,
  searchApplicants,
  searchUsers,
} from '@src/graphql/queries';
import { updateAffiliation, deleteAffiliation } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function OrganizationEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayNameValid, setDisplayNameValid] = useState('');
  const [city, setCity] = useState('');
  const [cityValid, setCityValid] = useState('');
  const [state, setState] = useState('');
  const [stateValid, setStateValid] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Affiliation, uuid).then((item) => {
          setEntity(item);
        });
      } else {
        API.graphql(graphqlOperation(getAffiliation, { id: uuid }))
          .then((result) => {
            if (result.data.getAffiliation != null) {
              const aff = deserializeModel(Affiliation, result.data.getAffiliation);
              setEntity(aff);
              setName(aff?.name);
              setDisplayName(aff?.display_name);
              setCity(aff?.city);
              setState(aff?.state);
            } else {
              router.replace('/');
            }
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }
  }, [router.query, router]);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        Promise.all([
          DataStore.query(Stay, (s) => s.stayFisherHouseId('eq', uuid)),
          DataStore.query(Affiliation, (a) => a.affiliationAssociatedAffiliationId('eq', uuid)),
          DataStore.query(ServiceMember, (s) =>
            s.or((s) =>
              s
                .serviceMemberBaseAssignedToId('eq', uuid)
                .serviceMemberTreatmentFacilityId('eq', uuid)
            )
          ),
          DataStore.query(HotelProperty, (p) => p.FisherHouseID('eq', uuid)),
          DataStore.query(Applicant, (a) => a.applicantAffiliationId('eq', uuid)),
          DataStore.query(User, (u) => u.AffiliationID('eq', uuid)),
        ]).then((results) => {
          const totalRecords = results.reduce((prev, a) => prev + a, 0);
          setIsDeletable(totalRecords == 0);
        });
      } else {
        Promise.all([
          API.graphql(
            graphqlOperation(searchStays, { filter: { stayFisherHouseId: { eq: uuid } } })
          ),
          API.graphql(
            graphqlOperation(searchAffiliations, {
              filter: { affiliationAssociatedAffiliationId: { eq: uuid } },
            })
          ),
          API.graphql(
            graphqlOperation(searchServiceMembers, {
              filter: {
                or: [
                  { serviceMemberBaseAssignedToId: { eq: uuid } },
                  { serviceMemberTreatmentFacilityId: { eq: uuid } },
                ],
              },
            })
          ),
          API.graphql(
            graphqlOperation(searchHotelProperties, {
              filter: { FisherHouseID: { eq: uuid } },
            })
          ),
          API.graphql(
            graphqlOperation(searchApplicants, {
              filter: { applicantAffiliationId: { eq: uuid } },
            })
          ),
          API.graphql(graphqlOperation(searchUsers, { filter: { AffiliationID: { eq: uuid } } })),
        ])
          .then((results) => {
            const totalRecords = results.reduce((prev, a) => {
              const key = Object.keys(a.data)[0];
              return prev + a.data[key].items.length;
            }, 0);
            setIsDeletable(totalRecords == 0);
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }
  }, [router.query]);

  const title =
    entity?.status == AFFILIATIONSTATUS.PENDING ||
      entity?.status == AFFILIATIONSTATUS.ACTIVE ||
      entity?.status == AFFILIATIONSTATUS.ARCHIVED
      ? 'Edit Organization'
      : 'New Organization';

  const updateEntityName = (e) => {
    setName(e.target.value);
  };

  const entityNameOnBlur = (e) => {
    setNameValid(validateRequired(e.target.value));
  };

  const updateEntityCity = (e) => {
    setCity(e.target.value);
  };

  const entityCityOnBlur = (e) => {
    setCityValid(validateRequired(e.target.value));
  };

  const updateEntityState = (e) => {
    setState(e.target.value);
    setStateValid(validateRequired(e.target.value));
  };

  const updateEntityDisplayName = (e) => {
    setDisplayName(e.target.value);
  };

  const isValidForm = () => {
    const localNameValid = validateRequired(name);
    setNameValid(localNameValid);
    const localCityValid = validateRequired(city);
    setCityValid(localCityValid);
    const localStateValid = validateRequired(state);
    setStateValid(localStateValid);
    return localNameValid.valid && localCityValid.valid && localStateValid.valid;
  };

  const saveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (!isValidForm()) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newAffiliation = Affiliation.copyOf(entity, (updated) => {
        (updated.status =
          entity.status == AFFILIATIONSTATUS.DRAFT ? AFFILIATIONSTATUS.PENDING : entity.status),
          (updated.name = name),
          (updated.display_name = displayName),
          (updated.city = city),
          (updated.state = state);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setMessage('Organization saved.');
          setTimeout(() => {
            router.push('/system/entities/organizations');
          }, 1500);
        });
      } else {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          AssociatedAffiliation,
          owner,
          ...objectToSave
        } = newAffiliation;
        API.graphql(
          graphqlOperation(updateAffiliation, {
            input: {
              ...objectToSave,
              affiliationAssociatedAffiliationId: newAffiliation.AssociatedAffiliation?.id,
            },
          })
        )
          .then((results) => {
            const newAff = deserializeModel(Affiliation, results.data.updateAffiliation);
            setEntity(newAff);
            setMessage('Organization saved.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/organizations');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving this Organization.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this organization? This action cannot be un-done.')
    ) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(entity);
      } else {
        API.graphql(
          graphqlOperation(deleteAffiliation, {
            input: { id: entity.id },
          })
        )
          .then(() => {
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/organizations');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Organization.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const archiveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (!isValidForm()) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newAffiliation = Affiliation.copyOf(entity, (updated) => {
        (updated.status = AFFILIATIONSTATUS.ARCHIVED),
          (updated.name = name),
          (updated.display_name = displayName),
          (updated.city = city),
          (updated.state = state);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setMessage('Organization archived.');
          setTimeout(() => {
            router.push('/system/entities/organizations');
          }, 1500);
        });
      } else {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          AssociatedAffiliation,
          owner,
          ...objectToSave
        } = newAffiliation;
        API.graphql(
          graphqlOperation(updateAffiliation, {
            input: {
              ...objectToSave,
              affiliationAssociatedAffiliationId: newAffiliation.AssociatedAffiliation?.id,
            },
          })
        )
          .then((results) => {
            const newAff = deserializeModel(Affiliation, results.data.updateAffiliation);
            setEntity(newAff);
            setMessage('Organization archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/organizations');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Organization.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const approveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    const newAffiliation = Affiliation.copyOf(entity, (updated) => {
      updated.status = AFFILIATIONSTATUS.ACTIVE;
      (updated.name = name),
        (updated.display_name = displayName),
        (updated.city = city),
        (updated.state = state);
    });
    if (shouldUseDatastore()) {
      DataStore.save(newAffiliation).then((item) => {
        setEntity(item);
        if (entity?.status == AFFILIATIONSTATUS.ARCHIVED) {
          setMessage('Organization unarchived.');
        } else {
          setMessage('Organization approved.');
        }
        setTimeout(() => {
          router.push('/system/entities/organizations');
        }, 1500);
      });
    } else {
      const {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        AssociatedAffiliation,
        owner,
        ...objectToSave
      } = newAffiliation;
      API.graphql(
        graphqlOperation(updateAffiliation, {
          input: {
            ...objectToSave,
            affiliationAssociatedAffiliationId: newAffiliation.AssociatedAffiliation?.id,
          },
        })
      )
        .then((results) => {
          const newAff = deserializeModel(Affiliation, results.data.updateAffiliation);
          setEntity(newAff);
          if (entity?.status == AFFILIATIONSTATUS.ARCHIVED) {
            setMessage('Organization unarchived.');
          } else {
            setMessage('Organization approved.');
          }
          setIsWaiting(false);
          setTimeout(() => {
            router.push('/system/entities/organizations');
          }, 1500);
        })
        .catch(() => {
          setMessage('There was an error approving this Organization.');
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  const appPaneClassNames = classNames('primary', 'app-pane', {
    loading: loadingCounter > 0 || entity == null,
  });

  const appControlClassNames = classNames('app-controls', {
    loading: loadingCounter > 0 || entity == null,
  });

  const shouldShowCancelWarning = () => {
    if (entity.status == AFFILIATIONSTATUS.DRAFT) {
      if (
        (name && name.length > 0) ||
        (displayName && displayName.length > 0) ||
        (city && city.length > 0) ||
        (state && state.length > 0)
      ) {
        return true;
      }
    }
    return false;
  };

  const cancelEntity = (e) => {
    e.preventDefault();
    if (shouldShowCancelWarning()) {
      if (
        confirm('Are you sure you want to leave this page? Information entered will not be saved.')
      ) {
        router.push('/system/entities/organizations');
      }
    } else {
      router.push('/system/entities/organizations');
    }
  };

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  } else if (!isAdministrator()) {
    // Only administrators should be able to access system paths.
    router.replace('/');
    return null;
  }

  return (
    <div className="page-container">
      <FisherhouseHeader title={config.title} description={config.description} />

      <PageHeader />

      <IntroBlock />

      <section className="main-content">
        <div className="container">
          <PageTitle prefix="System / " title="Organizations" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-organization">
                    <Textfield
                      label="Organization Name"
                      wrapperClass="organization-name"
                      inputValue={name}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={entityNameOnBlur}
                      isValid={nameValid.valid}
                      errorMessage={nameValid.message}
                    />
                    <Textfield
                      label="Display Name (Optional)"
                      wrapperClass="display-name"
                      inputValue={displayName}
                      inputOnChange={updateEntityDisplayName}
                    />

                    <Textfield
                      label="City"
                      wrapperClass="organization-city"
                      inputValue={city}
                      inputOnChange={updateEntityCity}
                      inputRequired
                      inputOnBlur={entityCityOnBlur}
                      isValid={cityValid.valid}
                      errorMessage={cityValid.message}
                    />
                    <StateField
                      inputValue={state}
                      inputOnChange={updateEntityState}
                      inputRequired
                      isValid={stateValid.valid}
                      errorMessage={stateValid.message}
                      wrapperClass="organization-state"
                    />
                  </div>
                </form>
              </section>

              <div className={appControlClassNames}>
                <SubmitButton
                  inputValue="Cancel"
                  inputClass="cancel"
                  inputOnClick={cancelEntity}
                  inputDisabled={buttonDisabled}
                />

                <SubmitButton
                  inputValue="Save"
                  inputOnClick={saveEntity}
                  inputDisabled={buttonDisabled}
                />

                {isDeletable && entity?.status != AFFILIATIONSTATUS.DRAFT && (
                  <SubmitButton
                    inputValue="Delete"
                    inputClass="delete"
                    inputOnClick={deleteEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}
                {!isDeletable &&
                  entity?.status != AFFILIATIONSTATUS.DRAFT &&
                  entity?.status != AFFILIATIONSTATUS.ARCHIVED && (
                    <SubmitButton
                      inputValue="Archive"
                      inputClass="archive"
                      inputOnClick={archiveEntity}
                      inputDisabled={buttonDisabled}
                    />
                  )}

                {entity?.status != AFFILIATIONSTATUS.ACTIVE && (
                  <SubmitButton
                    inputValue={
                      entity?.status == AFFILIATIONSTATUS.ARCHIVED ? 'Unarchive' : 'Approve'
                    }
                    inputOnClick={approveEntity}
                    inputClass="approve"
                    inputDisabled={buttonDisabled}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
