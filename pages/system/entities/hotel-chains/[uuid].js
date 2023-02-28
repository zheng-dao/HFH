import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { HotelChain, HotelProperty, HotelBrand } from '@src/models';
import { HOTELCHAINSTATUS } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getHotelChain, searchHotelProperties, searchHotelBrands } from '@src/graphql/queries';
import { updateHotelChain, deleteHotelChain } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function HotelChainEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [originalEntity, setOriginalEntity] = useState({});
  const [nameValid, setNameValid] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(HotelChain, uuid).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
        });
      } else {
        API.graphql(graphqlOperation(getHotelChain, { id: uuid }))
          .then((results) => {
            if (results.data.getHotelChain != null) {
              const hc = deserializeModel(HotelChain, results.data.getHotelChain);
              setEntity(hc);
              setOriginalEntity(hc);
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
          DataStore.query(HotelProperty, (p) => p.HotelChainID('eq', uuid)),
          DataStore.query(HotelBrand, (b) => b.hotelBrandHotelChainId('eq', uuid)),
        ]).then((results) => {
          const totalResults = results.reduce((prev, a) => prev + a.length, 0);
          setIsDeletable(totalResults == 0);
        });
      } else {
        Promise.all([
          API.graphql(
            graphqlOperation(searchHotelProperties, {
              filter: { HotelChainID: { eq: uuid } },
            })
          ),
          API.graphql(
            graphqlOperation(searchHotelBrands, {
              filter: { hotelBrandHotelChainId: { eq: uuid } },
            })
          ),
        ])
          .then((results) => {
            const totalResults = results.reduce((prev, a) => {
              const key = Object.keys(a.data)[0];
              return prev + a.data[key].items.length;
            }, 0);
            setIsDeletable(totalResults == 0);
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }
  }, [router.query]);

  const title =
    entity?.status == HOTELCHAINSTATUS.PENDING ||
    entity?.status == HOTELCHAINSTATUS.ACTIVE ||
    entity?.status == HOTELCHAINSTATUS.ARCHIVED
      ? 'Edit Hotel Chain'
      : 'New Hotel Chain';

  const updateEntityName = (e) => {
    setEntity(
      HotelChain.copyOf(entity, (updated) => {
        updated.name = e.target.value;
      })
    );
  };

  const entityNameOnBlur = (e) => {
    setNameValid(validateRequired(e.target.value));
  };

  const isValidForm = () => {
    const isNameValid = validateRequired(entity.name);
    setNameValid(isNameValid);
    return isNameValid.valid;
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
      const newHotelChain = HotelChain.copyOf(originalEntity, (updated) => {
        (updated.status = HOTELCHAINSTATUS.ACTIVE), (updated.name = entity.name);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newHotelChain).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          if (entity?.status == HOTELCHAINSTATUS.ARCHIVED) {
            setMessage('Hotel Chain unarchived.');
          } else {
            setMessage('Hotel Chain saved.');
          }
          setTimeout(() => {
            router.push('/system/entities/hotel-chains');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = newHotelChain;
        API.graphql(graphqlOperation(updateHotelChain, { input: objectToSave }))
          .then((results) => {
            const newHC = deserializeModel(HotelChain, results.data.updateHotelChain);
            setEntity(newHC);
            setOriginalEntity(newHC);
            if (entity?.status == HOTELCHAINSTATUS.ARCHIVED) {
              setMessage('Hotel Chain unarchived.');
            } else {
              setMessage('Hotel Chain saved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-chains');
            }, 1500);
          })
          .catch((err) => {
            console.log('Caught error', err);
            setMessage(
              'There was an error saving the Hotel Chain. Please reload the page and try again.'
            );
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this Hotel Chain? This action cannot be un-done.')
    ) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(originalEntity);
      } else {
        API.graphql(
          graphqlOperation(deleteHotelChain, {
            input: { id: originalEntity.id },
          })
        )
          .then(() => {
            setTimeout(() => {
              router.push('/system/entities/hotel-chains');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Hotel Chain.');
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
      const newHotelChain = HotelChain.copyOf(originalEntity, (updated) => {
        (updated.status = HOTELCHAINSTATUS.ARCHIVED), (updated.name = entity.name);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newHotelChain).then((item) => {
          setEntity(item);
          setMessage('Hotel Chain archived.');
          setTimeout(() => {
            router.push('/system/entities/hotel-chains');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = newHotelChain;
        API.graphql(graphqlOperation(updateHotelChain, { input: objectToSave }))
          .then((results) => {
            const newHC = deserializeModel(HotelChain, results.data.updateHotelChain);
            setEntity(newHC);
            setOriginalEntity(newHC);
            setMessage('Hotel Chain archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-chains');
            }, 1500);
          })
          .catch((err) => {
            console.log('Caught error', err);
            setMessage(
              'There was an error saving the Hotel Chain. Please reload the page and try again.'
            );
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
    if (entity.status == HOTELCHAINSTATUS.DRAFT) {
      if (entity?.name && entity.name.length > 0) {
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
        router.push('/system/entities/hotel-chains');
      }
    } else {
      router.push('/system/entities/hotel-chains');
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
          <PageTitle prefix="System / " title="Hotel Chains" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-hotel-chain">
                    <Textfield
                      label="Hotel Chain Name"
                      inputValue={entity?.name}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={entityNameOnBlur}
                      isValid={nameValid.valid}
                      errorMessage={nameValid.message}
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
                  inputValue={entity?.status == HOTELCHAINSTATUS.ARCHIVED ? 'Unarchive' : 'Save'}
                  inputOnClick={saveEntity}
                  inputDisabled={buttonDisabled}
                />

                {isDeletable && entity?.status != HOTELCHAINSTATUS.DRAFT && (
                  <SubmitButton
                    inputValue="Delete"
                    inputClass="delete"
                    inputOnClick={deleteEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}
                {!isDeletable &&
                  entity?.status != HOTELCHAINSTATUS.DRAFT &&
                  entity?.status != HOTELCHAINSTATUS.ARCHIVED && (
                    <SubmitButton
                      inputValue="Archive"
                      inputClass="archive"
                      inputOnClick={archiveEntity}
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
