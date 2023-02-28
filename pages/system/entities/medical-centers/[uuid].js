import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Affiliation, Stay, ServiceMember, HotelProperty, Applicant, User } from '@src/models';
import { AFFILIATIONSTATUS, AFFILIATIONTYPE } from '@src/API';
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
import validateZip from '@utils/validators/zip';

export default function MedicalCenterEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [originalEntity, setOriginalEntity] = useState({});
  const [bases, setBases] = useState([]);
  const [archivedBases, setArchivedBases] = useState([]);
  const [nameValid, setNameValid] = useState(false);
  const [displayNameValid, setDisplayNameValid] = useState(false);
  const [address1Valid, setAddress1Valid] = useState(false);
  const [cityValid, setCityValid] = useState(false);
  const [stateValid, setStateValid] = useState(false);
  const [zipValid, setZipValid] = useState(false);
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
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(
        Affiliation,
        (c) => c.status('ne', AFFILIATIONSTATUS.DRAFT).type('eq', AFFILIATIONTYPE.BASE),
        { page: 0, limit: 999999 }
      ).then((items) => {
        setBases(items);
      });
    } else {
      API.graphql(
        graphqlOperation(searchAffiliations, {
          filter: {
            or: [
              { status: { eq: AFFILIATIONSTATUS.ARCHIVED } },
              { status: { eq: AFFILIATIONSTATUS.ACTIVE } },
            ],
            type: { eq: AFFILIATIONTYPE.BASE },
          },
        })
      )
        .then((results) => {
          if (results.data.searchAffiliations.items.length > 0) {
            const sortedData = results.data.searchAffiliations.items
              .map((item) => deserializeModel(Affiliation, item))
              .sort((a, b) => {
                if (a.status == b.status) {
                  return a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' });
                } else {
                  if (
                    a.status == AFFILIATIONSTATUS.ARCHIVED &&
                    b.status == AFFILIATIONSTATUS.ACTIVE
                  ) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              });
            const activeBases = sortedData.filter(
              (item) => item.status === AFFILIATIONSTATUS.ACTIVE
            );
            const arcBases = sortedData.filter(
              (item) => item.status === AFFILIATIONSTATUS.ARCHIVED
            );
            setBases(activeBases);
            setArchivedBases(arcBases);
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

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
      ? 'Edit Medical Center'
      : 'New Medical Center';

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

  const updateEntityAddress = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.address = e.target.value;
      })
    );
  };

  const entityAddressOnBlur = (e) => {
    setAddress1Valid(validateRequired(e.target.value));
  };

  const updateEntityAddress2 = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.address_2 = e.target.value;
      })
    );
  };

  const updateEntityCity = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.city = e.target.value;
      })
    );
  };

  const entityCityOnBlur = (e) => {
    setCityValid(validateRequired(e.target.value, 'The Medical Center City'));
  };

  const updateEntityState = (e) => {
    const localStateValid = validateRequired(e.target.value, 'The Medical Center State');
    setStateValid(localStateValid);
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.state = e.target.value;
      })
    );
  };

  const updateEntityZip = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.zip = e.target.value;
      })
    );
  };

  const entityZipOnBlur = (e) => {
    setZipValid(validateZip(e.target.value, true));
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

  const updateEntityAssociatedAffiliation = (e) => {
    setEntity(
      Affiliation.copyOf(entity, (updated) => {
        updated.AssociatedAffiliation = bases.find((item) => item.id == e?.value);
      })
    );
  };

  const isValidForm = () => {
    const localNameValid = validateRequired(entity.name);
    setNameValid(localNameValid);
    const localAddress1Valid = validateRequired(entity.address);
    setAddress1Valid(localAddress1Valid);
    const localCityValid = validateRequired(entity.city, 'The Medical Center City');
    setCityValid(localCityValid);
    const localStateValid = validateRequired(entity.state, 'The Medical Center State');
    setStateValid(localStateValid);
    const localZipValid = validateZip(entity.zip, true);
    setZipValid(localZipValid);
    return (
      localNameValid.valid &&
      localAddress1Valid.valid &&
      localCityValid.valid &&
      localStateValid.valid &&
      localZipValid.valid
    );
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
          (updated.address = entity.address),
          (updated.address_2 = entity.address_2),
          (updated.city = entity.city),
          (updated.state = entity.state),
          (updated.zip = entity.zip),
          (updated.AssociatedAffiliation = entity.AssociatedAffiliation);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          setMessage('Medical Center saved.');
          setTimeout(() => {
            router.push('/system/entities/medical-centers');
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
            setMessage('Medical Center saved.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/medical-centers');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving this Medical Center.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this Medical Center? This action cannot be un-done.')
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
              router.push('/system/entities/medical-centers');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Medical Center.');
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
          (updated.name = entity.name),
          (updated.display_name = entity.display_name),
          (updated.address = entity.address),
          (updated.address_2 = entity.address_2),
          (updated.city = entity.city),
          (updated.state = entity.state),
          (updated.zip = entity.zip),
          (updated.AssociatedAffiliation = entity.AssociatedAffiliation);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setMessage('Medical Center archived.');
          setTimeout(() => {
            router.push('/system/entities/medical-centers');
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
            setMessage('Medical Center archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/medical-centers');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Medical Center.');
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
      const newAffiliation = Affiliation.copyOf(originalEntity, (updated) => {
        (updated.status = AFFILIATIONSTATUS.ACTIVE),
          (updated.name = entity.name),
          (updated.display_name = entity.display_name),
          (updated.address = entity.address),
          (updated.address_2 = entity.address_2),
          (updated.city = entity.city),
          (updated.state = entity.state),
          (updated.zip = entity.zip),
          (updated.AssociatedAffiliation = entity.AssociatedAffiliation);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newAffiliation).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          if (entity?.status == AFFILIATIONSTATUS.ARCHIVED) {
            setMessage('Medical Center unarchived.');
          } else {
            setMessage('Medical Center approved.');
          }
          setTimeout(() => {
            router.push('/system/entities/medical-centers');
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
              setMessage('Medical Center unarchived.');
            } else {
              setMessage('Medical Center approved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/medical-centers');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error approving this Medical Center.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const { loadingInitial, isAuthenticated, isAdministrator } = useAuth();

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
        (entity?.address && entity.address.length > 0) ||
        (entity?.address_2 && entity.address_2.length > 0) ||
        (entity?.city && entity.city.length > 0) ||
        (entity?.state && entity.state.length > 0) ||
        (entity?.zip && entity.zip.length > 0) ||
        entity.AssociatedAffiliation
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
        router.push('/system/entities/medical-centers');
      }
    } else {
      router.push('/system/entities/medical-centers');
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
          <PageTitle prefix="System / " title="Medical Centers" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-medcenter">
                    <Textfield
                      label="Medical Center Name"
                      wrapperClass="medcenter-name"
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
                      label="Military Base (Optional)"
                      wrapperClass="medcenter-base"
                      inputValue={entity?.AssociatedAffiliation?.id}
                      inputRequired={false}
                      options={
                        bases.find((item) => item.id === entity?.AssociatedAffiliation?.id) ?
                          bases.map((item) => {
                            return { value: item.id, label: item.name };
                          })
                          :
                          archivedBases.find((item) => item.id === entity?.AssociatedAffiliation?.id) ?
                            [...bases, archivedBases.find((item) => item.id === entity?.AssociatedAffiliation?.id)].map((item) => {
                              return { value: item.id, label: item.name };
                            })
                            :
                            bases.map((item) => {
                              return { value: item.id, label: item.name };
                            })

                      }
                      inputOnChange={updateEntityAssociatedAffiliation}
                      blankValue=""
                      useReactSelect
                      useRegularSelect={false}
                      placeholder="Select Military Base..."
                      // inputDisabled={archivedBases.findIndex((item) => item.id === entity?.AssociatedAffiliation?.id) !== -1}
                    />

                    <div className="street-address-block">
                      <Textfield
                        label="Street Address"
                        wrapperClass="street-address"
                        inputValue={entity?.address}
                        inputOnChange={updateEntityAddress}
                        inputRequired
                        inputOnBlur={entityAddressOnBlur}
                        isValid={address1Valid.valid}
                        errorMessage={address1Valid.message}
                      >
                        <input
                          className="no-label"
                          type="text"
                          value={entity?.address_2}
                          onChange={updateEntityAddress2}
                        />
                      </Textfield>

                      <Textfield
                        label="City"
                        wrapperClass="city"
                        inputValue={entity?.city}
                        inputOnChange={updateEntityCity}
                        inputRequired
                        inputOnBlur={entityCityOnBlur}
                        isValid={cityValid.valid}
                        errorMessage={''}
                      />
                      <StateField
                        inputValue={entity?.state}
                        inputOnChange={updateEntityState}
                        inputRequired
                        isValid={stateValid.valid}
                        errorMessage={''}
                      />
                      <Textfield
                        label="Zip"
                        wrapperClass="zip"
                        inputValue={entity?.zip}
                        inputOnChange={updateEntityZip}
                        inputRequired
                        inputOnBlur={entityZipOnBlur}
                        isValid={zipValid.valid}
                        errorMessage={''}
                      />
                      {(cityValid.message || stateValid.message || zipValid.message) && (
                        <Fragment>
                          <p className="errMsg">
                            {[cityValid.message, stateValid.message, zipValid.message]
                              .filter((i) => i)
                              .join(' ')}
                          </p>
                        </Fragment>
                      )}
                    </div>
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
