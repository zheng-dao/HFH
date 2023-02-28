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
import Selectfield from '@components/Inputs/Selectfield';
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

export default function MilitaryBaseEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [originalEntity, setOriginalEntity] = useState({});
  const [nameValid, setNameValid] = useState(false);
  const [displayNameValid, setDisplayNameValid] = useState(false);
  const [cityValid, setCityValid] = useState(false);
  const [branchValid, setBranchValid] = useState(false);
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
          setOriginalEntity(item);
        });
      } else {
        API.graphql(graphqlOperation(getAffiliation, { id: uuid }))
          .then((result) => {
            if (result.data.getAffiliation != null) {
              const aff = deserializeModel(Affiliation, result.data.getAffiliation);
              setEntity(aff);
              setOriginalEntity(aff);
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
      ? 'Edit Military Base'
      : 'New Military Base';

  const updateEntityName = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.name = e.target.value;
      })
    );
  };

  const entityNameOnBlur = (e) => {
    setNameValid(validateRequired(e.target.value));
  };

  const updateEntityCity = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.city = e.target.value;
      })
    );
  };

  const entityCityOnBlur = (e) => {
    setCityValid(validateRequired(e.target.value));
  };

  const updateEntityState = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.state = e.target.value;
      })
    );
    setStateValid(validateRequired(e.target.value));
  };

  const updateEntityDisplayName = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.display_name = e.target.value;
      })
    );
  };

  const entityDisplayNameOnBlur = (e) => {
    setDisplayNameValid(validateRequired(e.target.value));
  };

  const updateEntityBranch = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.branch = e;
      })
    );
    setBranchValid(validateRequired(e));
  };

  const isValidForm = () => {
    const isNameValid = validateRequired(entity.name);
    setNameValid(isNameValid);
    const isCityValid = validateRequired(entity.city);
    setCityValid(isCityValid);
    const isStateValid = validateRequired(entity.state);
    setStateValid(isStateValid);
    const isBranchValid = validateRequired(entity.branch);
    setBranchValid(isBranchValid);
    return isNameValid.valid && isCityValid.valid && isStateValid.valid && isBranchValid.valid;
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
      const newAffiliation = Affiliation.copyOf(originalEntity, (updated) => {
        (updated.status =
          entity.status == AFFILIATIONSTATUS.DRAFT ? AFFILIATIONSTATUS.PENDING : entity.status),
          (updated.name = entity.name),
          (updated.display_name = entity.display_name),
          (updated.branch = entity.branch?.value),
          (updated.city = entity.city),
          (updated.state = entity.state);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          setMessage('Military Base saved.');
          setTimeout(() => {
            router.push('/system/entities/military-bases');
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
            setOriginalEntity(newAff);
            setMessage('Military Base saved.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/military-bases');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving this Military Base.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this Military Base? This action cannot be un-done.')
    ) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(entity);
      } else {
        API.graphql(
          graphqlOperation(deleteAffiliation, {
            input: { id: originalEntity.id },
          })
        )
          .then(() => {
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/military-bases');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Military Base.');
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
    if (
      !validateRequired(entity.name).valid ||
      !validateRequired(entity.city).valid
    ) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newAffiliation = Affiliation.copyOf(entity, (updated) => {
        (updated.status = AFFILIATIONSTATUS.ARCHIVED),
          (updated.name = entity.name),
          (updated.display_name = entity.display_name),
          (updated.branch = entity.branch?.value),
          (updated.city = entity.city),
          (updated.state = entity.state);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setMessage('Military Base archived.');
          setTimeout(() => {
            router.push('/system/entities/military-bases');
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
            setOriginalEntity(newAff);
            setMessage('Military Base archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/military-bases');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Military Base.');
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
    if (!isValidForm()) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newAffiliation = Affiliation.copyOf(entity, (updated) => {
        (updated.status = AFFILIATIONSTATUS.ACTIVE),
          (updated.name = entity.name),
          (updated.display_name = entity.display_name),
          (updated.branch = entity.branch?.value),
          (updated.city = entity.city),
          (updated.state = entity.state);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          if (entity?.status == AFFILIATIONSTATUS.ARCHIVED) {
            setMessage('Military Base unarchived.');
          } else {
            setMessage('Military Base approved.');
          }
          setTimeout(() => {
            router.push('/system/entities/military-bases');
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
            setOriginalEntity(newAff);
            if (entity?.status == AFFILIATIONSTATUS.ARCHIVED) {
              setMessage('Military Base unarchived.');
            } else {
              setMessage('Military Base approved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/military-bases');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error approving this Military Base.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
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
        (entity?.name && entity.name.length > 0) ||
        (entity?.display_name && entity.display_name.length > 0) ||
        (entity?.branch && entity.branch?.value.length > 0) ||
        (entity?.city && entity.city.length > 0) ||
        (entity?.state && entity.state.length > 0)
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
        router.push('/system/entities/military-bases');
      }
    } else {
      router.push('/system/entities/military-bases');
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
          <PageTitle prefix="System / " title="Military Bases" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-base">
                    <Textfield
                      label="Base Name"
                      wrapperClass="base-name"
                      inputValue={entity?.name}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={entityNameOnBlur}
                      isValid={nameValid.valid}
                      errorMessage={nameValid.message}
                    />
                    <Textfield
                      label="Display Name (Optional)"
                      wrapperClass="display-name"
                      inputValue={entity?.display_name}
                      inputOnChange={updateEntityDisplayName}
                    />
                    <Selectfield
                      label="Branch"
                      wrapperClass="base-branch"
                      inputValue={entity?.branch}
                      inputRequired={false}
                      options={BRANCHESOFSERVICE}
                      inputOnChange={updateEntityBranch}
                      blankValue={false}
                      isValid={branchValid.valid}
                      errorMessage={branchValid.message}
                      useReactSelect
                      useRegularSelect={false}
                      placeholder="Select a Branch..."
                    />

                    <Textfield
                      label="City"
                      wrapperClass="base-city"
                      inputValue={entity?.city}
                      inputOnChange={updateEntityCity}
                      inputRequired
                      inputOnBlur={entityCityOnBlur}
                      isValid={cityValid.valid}
                      errorMessage={cityValid.message}
                    />
                    <StateField
                      inputValue={entity?.state}
                      inputOnChange={updateEntityState}
                      inputRequired
                      isValid={stateValid.valid}
                      errorMessage={stateValid.message}
                      wrapperClass="base-state"
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
