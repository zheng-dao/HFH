import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Storage } from '@aws-amplify/storage';
import { HotelChain, HotelBrand, HotelProperty } from '@src/models';
import { HOTELCHAINSTATUS, HOTELBRANDSTATUS } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import Selectfield from '@components/Inputs/Selectfield';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getHotelBrand, listHotelChains, searchHotelProperties } from '@src/graphql/queries';
import { updateHotelBrand, deleteHotelBrand } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function HotelBrandEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [hotelBrandNameValid, setHotelBrandNameValid] = useState(false);
  const [originalEntity, setOriginalEntity] = useState({});
  const [chains, setChains] = useState([]);
  const [archivedChains, setArchivedChains] = useState([]);
  const [logo, setLogo] = useState('');
  const [logoValid, setLogoValid] = useState(false);
  const [hotelChainValid, setHotelChainValid] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [uploadNewFileVisible, setUploadNewFileVisible] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(HotelBrand, uuid).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
        });
      } else {
        API.graphql(graphqlOperation(getHotelBrand, { id: uuid }))
          .then((result) => {
            if (result.data.getHotelBrand != null) {
              const h = deserializeModel(HotelBrand, result.data.getHotelBrand);
              setEntity(h);
              setOriginalEntity(h);
            } else {
              router.replace('/');
            }
          })
          .finally(() => {
            setLoadingCounter((prev) => prev - 1);
          });
      }
    }
  }, [router.query, router]);

  useEffect(() => {
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(HotelChain, (c) => c.status('ne', HOTELCHAINSTATUS.DRAFT), {
        page: 0,
        limit: 999999,
      }).then((items) => {
        setChains(items);
      });
    } else {
      API.graphql(
        graphqlOperation(listHotelChains, {
          filter: { status: { ne: HOTELCHAINSTATUS.DRAFT } },
          limit: 100000,
        })
      )
        .then((results) => {
          if (results.data.listHotelChains.items.length > 0) {
            const activeChains = results.data.listHotelChains.items
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .filter((item) => item.status === HOTELCHAINSTATUS.ACTIVE)
              .map((item) => deserializeModel(HotelChain, item));
            const arcChains = results.data.listHotelChains.items
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .filter((item) => item.status === HOTELCHAINSTATUS.ARCHIVED)
              .map((item) => deserializeModel(HotelChain, item));
            setChains(activeChains);
            setArchivedChains(arcChains);
          }
        })
        .finally(() => {
          setLoadingCounter((prev) => prev - 1);
        });
    }
  }, []);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(HotelProperty, (p) => p.HotelBrandID('eq', uuid), { limit: 1 }).then(
          (results) => setIsDeletable(results.length == 0)
        );
      } else {
        API.graphql(
          graphqlOperation(searchHotelProperties, {
            filter: { HotelBrandID: { eq: uuid } },
          })
        )
          .then((results) => setIsDeletable(results.data.searchHotelProperties.items.length == 0))
          .finally(() => {
            setLoadingCounter((prev) => prev - 1);
          });
      }
    }
  }, [router.query]);

  const title =
    entity?.status == HOTELBRANDSTATUS.PENDING ||
    entity?.status == HOTELBRANDSTATUS.ACTIVE ||
    entity?.status == HOTELBRANDSTATUS.ARCHIVED
      ? 'Edit Hotel Brand'
      : 'New Hotel Brand';

  const updateEntityName = (e) => {
    setEntity(
      HotelBrand.copyOf(entity, (updated) => {
        updated.name = e.target.value;
      })
    );
  };

  const entityNameOnBlur = (e) => {
    setHotelBrandNameValid(validateRequired(e.target.value));
  };

  const updateEntityChain = (e) => {
    setEntity(
      HotelBrand.copyOf(entity, (updated) => {
        updated.HotelChain = chains.find((chain) => chain.id == e?.value);
        updated.hotelBrandHotelChainId = e?.value;
      })
    );
    setHotelChainValid(validateRequired(e));
  };

  const handleFileUpload = (e) => {
    if (typeof e.target.files[0] == 'undefined') {
      setLogoValid({
        valid: false,
        message: 'This field is required.',
      });
      return;
    }
    const file = e.target.files[0];

    const allowedFileTypes = ['image/jpeg', 'image/png'];
    if (!allowedFileTypes.includes(file.type)) {
      setMessage(
        'Invalid file format. If you continue to receive this error, please convert the file to a JPEG or PNG image and upload again.'
      );
    } else {
      Storage.put(file.name, file, {
        level: 'public',
        contentType: file.type,
      })
        .then((result) => {
          setEntity(
            HotelBrand.copyOf(entity, (updated) => {
              updated.logo = result.key;
            })
          );
          setUploadNewFileVisible(false);
          setLogoValid({
            valid: true,
            message: '',
          });
        })
        .catch((err) => {
          setMessage(
            'There was an error uploading your file. Please try again later, or use a different file.'
          );
          console.log(err);
        });
    }
  };

  const isValidForm = () => {
    const localHotelBrandNameValid = validateRequired(entity.name);
    setHotelBrandNameValid(localHotelBrandNameValid);
    const localHotelChainValid = validateRequired(entity.HotelChain);
    setHotelChainValid(localHotelChainValid);
    if (!entity.logo) {
      setLogoValid({
        valid: false,
        message: 'Please select a file.',
      });
    } else {
      setLogoValid({
        valid: true,
        message: '',
      });
    }
    return localHotelBrandNameValid.valid && localHotelChainValid.valid && entity.logo;
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
      const newHotelBrand = HotelBrand.copyOf(originalEntity, (updated) => {
        (updated.status = HOTELBRANDSTATUS.ACTIVE),
          (updated.name = entity.name),
          (updated.HotelChain = entity.HotelChain),
          (updated.hotelBrandHotelChainId = entity.HotelChain.id),
          (updated.logo = entity.logo);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newHotelBrand).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          if (entity?.status == HOTELCHAINSTATUS.ARCHIVED) {
            setMessage('Hotel Brand unarchived.');
          } else {
            setMessage('Hotel Brand saved.');
          }
          setTimeout(() => {
            router.push('/system/entities/hotel-brands');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, HotelChain, ...objectToSave } =
          newHotelBrand;
        API.graphql(graphqlOperation(updateHotelBrand, { input: objectToSave }))
          .then((results) => {
            const newHB = deserializeModel(HotelBrand, results.data.updateHotelBrand);
            setEntity(newHB);
            setOriginalEntity(newHB);
            if (entity?.status == HOTELCHAINSTATUS.ARCHIVED) {
              setMessage('Hotel Brand unarchived.');
            } else {
              setMessage('Hotel Brand saved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-brands');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving the Hotel Brand.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this Hotel Brand? This action cannot be un-done.')
    ) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(originalEntity);
      } else {
        API.graphql(
          graphqlOperation(deleteHotelBrand, {
            input: { id: originalEntity.id },
          })
        )
          .then(() => {
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-brands');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting the Hotel Brand.');
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
      const newHotelBrand = HotelBrand.copyOf(originalEntity, (updated) => {
        (updated.status = HOTELBRANDSTATUS.ARCHIVED),
          (updated.name = entity.name),
          (updated.HotelChain = entity.HotelChain),
          (updated.hotelBrandHotelChainId = entity.HotelChain.id),
          (updated.logo = entity.logo);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newHotelBrand).then((item) => {
          setEntity(item);
          setMessage('Hotel Brand archived.');
          setTimeout(() => {
            router.push('/system/entities/hotel-brands');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, HotelChain, ...objectToSave } =
          newHotelBrand;
        API.graphql(graphqlOperation(updateHotelBrand, { input: objectToSave }))
          .then((results) => {
            const newHB = deserializeModel(HotelBrand, results.data.updateHotelBrand);
            setEntity(newHB);
            setOriginalEntity(newHB);
            setMessage('Hotel Brand archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-brands');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Hotel Brand.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  useEffect(() => {
    if (entity?.logo && entity.logo.length > 0) {
      setLoadingCounter((prev) => prev + 1);
      Storage.get(entity.logo).then((url) => {
        setLogo(url);
        setLoadingCounter((prev) => prev - 1);
      });
    }
  }, [entity?.logo]);

  const { loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  const appPaneClassNames = classNames('primary', 'app-pane', {
    loading: loadingCounter > 0 || entity == null,
  });

  const appControlClassNames = classNames('app-controls', {
    loading: loadingCounter > 0 || entity == null,
  });

  const logoClassNames = classNames({
    error: !logoValid.valid && logoValid.message,
  });

  const shouldShowCancelWarning = () => {
    if (entity.status == HOTELBRANDSTATUS.DRAFT) {
      if ((entity?.name && entity.name.length > 0) || entity?.HotelChain || entity?.logo) {
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
        router.push('/system/entities/hotel-brands');
      }
    } else {
      router.push('/system/entities/hotel-brands');
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
          <PageTitle prefix="System / " title="Hotel Brands" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-hotel-brand">
                    <Textfield
                      label="Hotel Brand Name"
                      wrapperClass="hotel-brand-name"
                      inputValue={entity?.name}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={entityNameOnBlur}
                      isValid={hotelBrandNameValid.valid}
                      errorMessage={hotelBrandNameValid.message}
                    />
                    <Selectfield
                      label="Hotel Chain"
                      wrapperClass="hotel-brand_hotel-chain"
                      inputValue={entity?.HotelChain?.id}
                      options={
                        chains.find((item) => item.id === entity?.HotelChain?.id)
                          ? chains.map((item) => {
                              return { value: item.id, label: item.name };
                            })
                          : archivedChains.find((item) => item.id === entity?.HotelChain?.id)
                          ? [
                              ...chains,
                              archivedChains.find((item) => item.id === entity?.HotelChain?.id),
                            ].map((item) => {
                              return { value: item.id, label: item.name };
                            })
                          : chains.map((item) => {
                              return { value: item.id, label: item.name };
                            })
                      }
                      inputOnChange={updateEntityChain}
                      inputRequired
                      blankValue=""
                      isValid={hotelChainValid.valid}
                      errorMessage={hotelChainValid.message}
                      useReactSelect
                      useRegularSelect={false}
                      placeholder="Select a Hotel Chain..."
                      // inputDisabled={archivedChains.findIndex((item) => item.id === entity?.HotelChain?.id) !== -1}
                    />

                    {logo && (
                      <div className="input-combo hotel-brand-logo">
                        <label>Hotel Brand Logo</label>
                        <div className="image displaybox">
                          {logo && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={logo} alt="Hotel Brand Logo" />
                          )}
                        </div>
                      </div>
                    )}

                    {!uploadNewFileVisible && logo && (
                      <button
                        className="update"
                        onClick={(e) => {
                          e.preventDefault();
                          setUploadNewFileVisible(true);
                        }}
                      >
                        Update Logo File
                      </button>
                    )}

                    {(uploadNewFileVisible || !logo) && (
                      <div className="input-combo hotel-brand-logo-upload">
                        <label className={logoClassNames}>Upload Logo File</label>
                        <div className="selectbox">
                          <input type="file" onChange={handleFileUpload} />
                          {!logoValid.valid && logoValid.message && (
                            <p className="errMsg">{logoValid.message}</p>
                          )}
                        </div>
                      </div>
                    )}
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
                  inputValue={entity?.status == HOTELBRANDSTATUS.ARCHIVED ? 'Unarchive' : 'Save'}
                  inputOnClick={saveEntity}
                  inputDisabled={buttonDisabled}
                />

                {isDeletable && entity?.status != HOTELBRANDSTATUS.DRAFT && (
                  <SubmitButton
                    inputValue="Delete"
                    inputClass="delete"
                    inputOnClick={deleteEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}
                {!isDeletable &&
                  entity?.status != HOTELBRANDSTATUS.DRAFT &&
                  entity?.status != HOTELBRANDSTATUS.ARCHIVED && (
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
