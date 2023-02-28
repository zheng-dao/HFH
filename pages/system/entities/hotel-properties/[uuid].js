import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, Fragment } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Storage } from '@aws-amplify/storage';
import { HotelChain, HotelBrand, HotelProperty, Stay } from '@src/models';
import { HOTELCHAINSTATUS, HOTELBRANDSTATUS, HOTELPROPERTYSTATUS } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import Selectfield from '@components/Inputs/Selectfield';
import ContactInfoBlock from '@components/CommonInputs/ContactInfoBlock';
import SingleCheckbox from '@components/Inputs/SingleCheckbox';
import StateField from '@components/CommonInputs/StateField';
import { State } from '@utils/states';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import validatePhoneNumber from '@utils/validators/phone';
import validateEmail from '@utils/validators/email';
import validateNumeric from '@utils/validators/numeric';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  getHotelProperty,
  listHotelChains,
  listHotelBrands,
  searchStays,
} from '@src/graphql/queries';
import { updateHotelProperty, deleteHotelProperty } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';
import validateZip from '@utils/validators/zip';

export default function HotelPropertyEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [originalEntity, setOriginalEntity] = useState({});
  const [chains, setChains] = useState([]);
  const [archivedChains, setArchivedChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tempBrands, setTempBrands] = useState([]);
  const [archivedBrands, setArchivedBrands] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [hotelPropertyName, setHotelPropertyName] = useState('');
  const [hotelPropertyNameValid, setHotelPropertyNameValid] = useState(false);
  const [hotelPropertyChain, setHotelPropertyChain] = useState();
  const [hotelPropertyChainValid, setHotelPropertyChainValid] = useState(false);
  const [hotelPropertyBrand, setHotelPropertyBrand] = useState();
  const [hotelPropertyBrandValid, setHotelPropertyBrandValid] = useState(false);
  const [hotelPropertyAddr1, setHotelPropertyAddr1] = useState('');
  const [hotelPropertyAddr1Valid, setHotelPropertyAddr1Valid] = useState(false);
  const [hotelPropertyAddr2, setHotelPropertyAddr2] = useState('');
  const [hotelPropertyCity, setHotelPropertyCity] = useState('');
  const [hotelPropertyCityValid, setHotelPropertyCityValid] = useState(false);
  const [hotelPropertyState, setHotelPropertyState] = useState('');
  const [hotelPropertyStateValid, setHotelPropertyStateValid] = useState(false);
  const [hotelPropertyZip, setHotelPropertyZip] = useState('');
  const [hotelPropertyZipValid, setHotelPropertyZipValid] = useState(false);
  const [hotelPropertyContactName, setHotelPropertyContactName] = useState('');
  const [hotelPropertyContactNameValid, setHotelPropertyContactNameValid] = useState(false);
  const [hotelPropertyContactTitle, setHotelPropertyContactTitle] = useState('');
  const [hotelPropertyContactTitleValid, setHotelPropertyContactTitleValid] = useState(false);
  const [hotelPropertyContactEmail, setHotelPropertyContactEmail] = useState('');
  const [hotelPropertyContactEmailValid, setHotelPropertyContactEmailValid] = useState(false);
  const [hotelPropertyContactPhone, setHotelPropertyContactPhone] = useState('');
  const [hotelPropertyContactPhoneValid, setHotelPropertyContactPhoneValid] = useState(false);
  const [hotelPropertyContactExt, setHotelPropertyContactExt] = useState('');
  const [hotelPropertyContactExtValid, setHotelPropertyContactExtValid] = useState(false);
  const [hotelPropertyBlacklistStatus, setHotelPropertyBlacklistStatus] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);

  const [isUpdateChain, setIsUpdateChain] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(HotelProperty, uuid).then((item) => {
          setEntity(item);
          setOriginalEntity(item);
          setHotelPropertyName(item.name);
          setHotelPropertyChain({ label: item.HotelChain?.name, value: item.HotelChain?.id });
          setHotelPropertyBrand({ label: item.HotelBrand?.name, value: item.HotelBrand?.id });
          setHotelPropertyAddr1(item.address);
          setHotelPropertyAddr2(item.address_2);
          setHotelPropertyCity(item.city);
          setHotelPropertyState(item.state);
          setHotelPropertyZip(item.zip);
          setHotelPropertyContactName(item.contact_name);
          setHotelPropertyContactTitle(item.contact_position);
          setHotelPropertyContactEmail(item.email);
          setHotelPropertyContactPhone(item.telephone);
          setHotelPropertyContactExt(item.extension);
          setHotelPropertyBlacklistStatus(item.is_blacklist);
        });
      } else {
        API.graphql(graphqlOperation(getHotelProperty, { id: uuid }))
          .then((result) => {
            if (result.data.getHotelProperty != null) {
              const item = deserializeModel(HotelProperty, result.data.getHotelProperty);
              setEntity(item);
              setOriginalEntity(item);
              setHotelPropertyName(item.name);
              if (item.HotelChain !== null) {
                setHotelPropertyChain({ label: item.HotelChain?.name, value: item.HotelChain?.id });
              } else {
                setHotelPropertyChain();
              }
              if (item.HotelBrand !== null) {
                setHotelPropertyBrand({ label: item.HotelBrand?.name, value: item.HotelBrand?.id });
              } else {
                setHotelPropertyBrand();
              }
              setHotelPropertyAddr1(item.address);
              setHotelPropertyAddr2(item.address_2);
              setHotelPropertyCity(item.city);
              setHotelPropertyState(item.state);
              setHotelPropertyZip(item.zip);
              setHotelPropertyContactName(item.contact_name);
              setHotelPropertyContactTitle(item.contact_position);
              setHotelPropertyContactEmail(item.email);
              setHotelPropertyContactPhone(item.telephone);
              setHotelPropertyContactExt(item.extension);
              setHotelPropertyBlacklistStatus(item.is_blacklist);
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
        HotelChain,
        (c) => c.status('ne', HOTELCHAINSTATUS.DRAFT).status('ne', null),
        {
          page: 0,
          limit: 999999,
        }
      ).then((items) => {
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
            const archivedChains = results.data.listHotelChains.items
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .filter((item) => item.status === HOTELCHAINSTATUS.ARCHIVED)
              .map((item) => deserializeModel(HotelChain, item));
            setChains(activeChains);
            setArchivedChains(archivedChains);
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    if (!isUpdateChain) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(
          HotelBrand,
          (c) => c.status('ne', HOTELBRANDSTATUS.DRAFT).status('ne', null),
          {
            page: 0,
            limit: 999999,
          }
        ).then((items) => {
          setBrands(items);
        });
      } else {
        API.graphql(
          graphqlOperation(listHotelBrands, {
            filter: { status: { ne: HOTELBRANDSTATUS.DRAFT } },
            limit: 10000,
          })
        )
          .then((results) => {
            if (results.data.listHotelBrands.items.length > 0) {
              const activeBrands = results.data.listHotelBrands.items
                .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .filter((item) => item.status === HOTELBRANDSTATUS.ACTIVE)
                .map((item) => deserializeModel(HotelBrand, item));
              const arcBrands = results.data.listHotelBrands.items
                .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .filter((item) => item.status === HOTELBRANDSTATUS.ARCHIVED)
                .map((item) => deserializeModel(HotelBrand, item));
              if (hotelPropertyChain) {
                setBrands(
                  activeBrands.filter(
                    (brand) => brand.hotelBrandHotelChainId === hotelPropertyChain?.value
                  )
                );
              } else {
                setBrands(activeBrands);
              }
              setTempBrands(activeBrands);
              setArchivedBrands(arcBrands);
            }
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }

  }, [hotelPropertyChain]);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Stay, (s) => s.HotelPropertyID('eq', uuid), { limit: 1 }).then((results) =>
          setIsDeletable(results == 0)
        );
      } else {
        API.graphql(graphqlOperation(searchStays, { filter: { HotelPropertyID: { eq: uuid } } }))
          .then((results) => {
            setIsDeletable(results.data.searchStays.items.length == 0);
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }
  }, [router.query]);

  const title =
    entity?.status == HOTELPROPERTYSTATUS.PENDING ||
      entity?.status == HOTELPROPERTYSTATUS.ACTIVE ||
      entity?.status == HOTELPROPERTYSTATUS.ARCHIVED ||
      entity?.status == HOTELPROPERTYSTATUS.BLACKLISTED
      ? 'Edit Hotel Property'
      : 'New Hotel Property';

  const updateEntityName = (e) => {
    setHotelPropertyName(e.target.value);
  };

  const entityNameOnBlur = (e) => {
    setHotelPropertyNameValid(validateRequired(e.target.value));
  };

  const updateEntityAddress = (e) => {
    setHotelPropertyAddr1(e.target.value);
  };

  const entityAddressOnBlur = (e) => {
    setHotelPropertyAddr1Valid(validateRequired(e.target.value));
  };

  const updateEntityAddress2 = (e) => {
    setHotelPropertyAddr2(e.target.value);
  };

  const updateEntityCity = (e) => {
    setHotelPropertyCity(e.target.value);
  };

  const entityCityOnBlur = (e) => {
    setHotelPropertyCityValid(validateRequired(e.target.value, 'The Hotel Property City'));
  };

  const updateEntityState = (e) => {
    setHotelPropertyState(e.target.value);
    setHotelPropertyStateValid(validateRequired(e.target.value, 'The Hotel Property State'));
  };

  const updateEntityZip = (e) => {
    setHotelPropertyZip(e.target.value);
  };

  const entityZipOnBlur = (e) => {
    setHotelPropertyZipValid(validateZip(e.target.value, true));
  };

  const updateEntityContactName = (e) => {
    setHotelPropertyContactName(e.target.value);
  };

  const entityContactNameOnBlur = (e) => {
    setHotelPropertyContactNameValid(validateRequired(e.target.value));
  };

  const updateEntityContactPosition = (e) => {
    setHotelPropertyContactTitle(e.target.value);
  };

  const entityContactPositionOnBlur = (e) => {
    setHotelPropertyContactTitleValid(validateRequired(e.target.value));
  };

  const updateEntityEmail = (e) => {
    setHotelPropertyContactEmail(e.target.value);
  };

  const entityContactEmailOnBlur = (e) => {
    setHotelPropertyContactEmailValid(validateEmail(e.target.value));
  };

  const updateEntityTelephone = (e) => {
    setHotelPropertyContactPhone(e);
  };

  const entityContactPhoneOnBlur = (e) => {
    setHotelPropertyContactPhoneValid(validatePhoneNumber(e.target.value));
  };

  const updateEntityExtension = (e) => {
    setHotelPropertyContactExt(e.target.value);
  };

  const entityContactExtensionOnBlur = (e) => {
    setHotelPropertyContactExtValid(validateNumeric(e.target.value));
  };

  const updateEntityIsBlacklisted = (e) => {
    setHotelPropertyBlacklistStatus(e.target.checked);
  };

  const updateEntityChain = (e) => {
    if (e === null) {
      setBrands(tempBrands);
    } else {
      const brand = tempBrands.find((item) => item.id === hotelPropertyBrand?.value);
      if (brand) {
        if (brand.hotelBrandHotelChainId === e.value) {
        } else {
          setHotelPropertyBrand();
        }
      }
      setBrands(tempBrands.filter((item) => item.hotelBrandHotelChainId === e.value));
    }
    setIsUpdateChain(true);
    setHotelPropertyChain(e);
    setHotelPropertyChainValid(validateRequired(e));
  };

  const updateEntityBrand = (e) => {
    setHotelPropertyBrand(e);
    setHotelPropertyBrandValid(validateRequired(e));
  };

  const isValidForm = () => {
    const localHotelPropertyNameValid = validateRequired(hotelPropertyName);
    setHotelPropertyNameValid(localHotelPropertyNameValid);
    const localHotelPropertyAddr1Valid = validateRequired(hotelPropertyAddr1);
    setHotelPropertyAddr1Valid(localHotelPropertyAddr1Valid);
    const localHotelPropertyCityValid = validateRequired(
      hotelPropertyCity,
      'The Hotel Property City'
    );
    setHotelPropertyCityValid(localHotelPropertyCityValid);
    const localHotelPropertyStateValid = validateRequired(
      hotelPropertyState,
      'The Hotel Property State'
    );
    setHotelPropertyStateValid(localHotelPropertyStateValid);
    const localHotelPropertyZipValid = validateZip(hotelPropertyZip, true);
    setHotelPropertyZipValid(localHotelPropertyZipValid);
    const localHotelPropertyContactPhoneValid = validatePhoneNumber(hotelPropertyContactPhone);
    setHotelPropertyContactPhoneValid(localHotelPropertyContactPhoneValid);
    const localHotelPropertyBrandValid = validateRequired(hotelPropertyBrand);
    setHotelPropertyBrandValid(localHotelPropertyBrandValid);
    const localHotelPropertyChainValid = validateRequired(hotelPropertyChain);
    setHotelPropertyChainValid(localHotelPropertyChainValid);
    return (
      localHotelPropertyNameValid.valid &&
      localHotelPropertyAddr1Valid.valid &&
      localHotelPropertyCityValid.valid &&
      localHotelPropertyStateValid.valid &&
      localHotelPropertyZipValid.valid &&
      localHotelPropertyContactPhoneValid.valid &&
      localHotelPropertyBrandValid.valid &&
      localHotelPropertyChainValid.valid
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
      const newHotelProperty = HotelProperty.copyOf(entity, (updated) => {
        (updated.name = hotelPropertyName),
          (updated.address = hotelPropertyAddr1),
          (updated.address_2 = hotelPropertyAddr2),
          (updated.city = hotelPropertyCity),
          (updated.state = hotelPropertyState),
          (updated.zip = hotelPropertyZip),
          (updated.contact_name = hotelPropertyContactName),
          (updated.contact_position = hotelPropertyContactTitle),
          (updated.email = hotelPropertyContactEmail),
          (updated.telephone = hotelPropertyContactPhone),
          (updated.extension = hotelPropertyContactExt),
          (updated.is_blacklist = hotelPropertyBlacklistStatus),
          (updated.status = hotelPropertyBlacklistStatus
            ? HOTELPROPERTYSTATUS.BLACKLISTED
            : HOTELPROPERTYSTATUS.ACTIVE),
          (updated.HotelChainID = hotelPropertyChain?.value),
          (updated.HotelBrandID = hotelPropertyBrand?.value);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newHotelProperty).then((item) => {
          setEntity(item);
          if (entity?.status == HOTELPROPERTYSTATUS.ARCHIVED) {
            setMessage('Hotel Property unarchived.');
          } else {
            setMessage('Hotel Property saved.');
          }
          setTimeout(() => {
            router.push('/system/entities/hotel-properties');
          }, 1500);
        });
      } else {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          FisherHouse,
          HotelChain,
          HotelBrand,
          ...objectToSave
        } = newHotelProperty;
        API.graphql(graphqlOperation(updateHotelProperty, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(HotelProperty, results.data.updateHotelProperty));
            if (entity?.status == HOTELPROPERTYSTATUS.ARCHIVED) {
              setMessage('Hotel Property unarchived.');
            } else {
              setMessage('Hotel Property saved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-properties');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving this Hotel Property.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this Hotel Property? This action cannot be un-done.')
    ) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(originalEntity);
      } else {
        API.graphql(
          graphqlOperation(deleteHotelProperty, {
            input: { id: entity.id },
          })
        )
          .then(() => {
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-properties');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Hotel Property.');
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
      const newHotelProperty = HotelProperty.copyOf(originalEntity, (updated) => {
        (updated.name = hotelPropertyName),
          (updated.address = hotelPropertyAddr1),
          (updated.address_2 = hotelPropertyAddr2),
          (updated.city = hotelPropertyCity),
          (updated.state = hotelPropertyState),
          (updated.zip = hotelPropertyZip),
          (updated.contact_name = hotelPropertyContactName),
          (updated.contact_position = hotelPropertyContactTitle),
          (updated.email = hotelPropertyContactEmail),
          (updated.telephone = hotelPropertyContactPhone),
          (updated.extension = hotelPropertyContactExt),
          (updated.is_blacklist = hotelPropertyBlacklistStatus),
          (updated.status = HOTELPROPERTYSTATUS.ARCHIVED),
          (updated.HotelChainID = hotelPropertyChain?.value),
          (updated.HotelBrandID = hotelPropertyBrand?.value);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newHotelProperty).then((item) => {
          setEntity(item);
          setMessage('Hotel Property archived.');
          setTimeout(() => {
            router.push('/system/entities/hotel-properties');
          }, 1500);
        });
      } else {
        const {
          createdAt,
          updatedAt,
          _deleted,
          _lastChangedAt,
          FisherHouse,
          HotelChain,
          HotelBrand,
          ...objectToSave
        } = newHotelProperty;
        API.graphql(graphqlOperation(updateHotelProperty, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(HotelProperty, results.data.updateHotelProperty));
            setMessage('Hotel Property archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/hotel-properties');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Hotel Property.');
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
    if (entity.status == HOTELPROPERTYSTATUS.DRAFT) {
      if (
        (hotelPropertyName && hotelPropertyName.length > 0) ||
        (hotelPropertyAddr1 && hotelPropertyAddr1.length > 0) ||
        (hotelPropertyAddr2 && hotelPropertyAddr2.length > 0) ||
        (hotelPropertyCity && hotelPropertyCity.length > 0) ||
        (hotelPropertyState && hotelPropertyState.length > 0) ||
        (hotelPropertyZip && hotelPropertyZip.length > 0) ||
        (hotelPropertyContactName && hotelPropertyContactName.length > 0) ||
        (hotelPropertyContactTitle && hotelPropertyContactTitle.length > 0) ||
        (hotelPropertyContactEmail && hotelPropertyContactEmail.length > 0) ||
        (hotelPropertyContactPhone && hotelPropertyContactPhone.length > 0) ||
        (hotelPropertyContactExt && hotelPropertyContactExt.length > 0) ||
        hotelPropertyBlacklistStatus ||
        hotelPropertyChain?.value ||
        hotelPropertyBrand?.value
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
        router.push('/system/entities/hotel-properties');
      }
    } else {
      router.push('/system/entities/hotel-properties');
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
          <PageTitle prefix="System / " title="Hotel Properties" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-hotel-property">
                    <Textfield
                      label="Hotel Property Name"
                      wrapperClass="hotel-property-name"
                      inputValue={hotelPropertyName}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={entityNameOnBlur}
                      isValid={hotelPropertyNameValid.valid}
                      errorMessage={hotelPropertyNameValid.message}
                    />
                    <Selectfield
                      label="Hotel Chain"
                      wrapperClass="hotel-property_hotel-chain"
                      inputValue={hotelPropertyChain}
                      inputRequired
                      options={
                        chains.find((item) => item.id === hotelPropertyChain)
                          ? chains.map((item) => {
                            return { value: item.id, label: item.name };
                          })
                          : archivedChains.find((item) => item.id === hotelPropertyChain)
                            ? [
                              ...chains.map((item) => {
                                return { value: item.id, label: item.name };
                              }),
                              archivedChains.find((item) => item.id === hotelPropertyChain),
                            ]
                            : chains.map((item) => {
                              return { value: item.id, label: item.name };
                            })
                      }
                      inputOnChange={updateEntityChain}
                      blankValue=""
                      isValid={hotelPropertyChainValid.valid}
                      errorMessage={hotelPropertyChainValid.message}
                      useReactSelect
                      useRegularSelect={false}
                      placeholder="Select a Hotel Chain..."
                    // inputDisabled={archivedChains.findIndex((item) => item.value === hotelPropertyChain) !== -1}
                    />
                    <Selectfield
                      label="Hotel Brand"
                      wrapperClass="hotel-property_hotel-brand"
                      inputValue={hotelPropertyBrand}
                      inputRequired
                      options={
                        brands.find((item) => item.id === hotelPropertyBrand)
                          ? brands.map((item) => {
                            return { value: item.id, label: item.name };
                          })
                          : archivedBrands.find((item) => item.id === hotelPropertyBrand)
                            ? [
                              ...brands.map((item) => {
                                return { value: item.id, label: item.name };
                              }),
                              archivedBrands.find((item) => item.id === hotelPropertyBrand),
                            ]
                            : brands.map((item) => {
                              return { value: item.id, label: item.name };
                            })
                      }
                      inputOnChange={updateEntityBrand}
                      blankValue=""
                      isValid={hotelPropertyBrandValid.valid}
                      errorMessage={hotelPropertyBrandValid.message}
                      useReactSelect
                      useRegularSelect={false}
                      placeholder="Select a Hotel Brand..."
                    // inputDisabled={archivedBrands.findIndex((item) => item.value === hotelPropertyBrand) !== -1}
                    />

                    <div className="street-address-block">
                      <Textfield
                        label="Street Address"
                        wrapperClass="street-address"
                        inputValue={hotelPropertyAddr1}
                        inputOnChange={updateEntityAddress}
                        inputRequired
                        inputOnBlur={entityAddressOnBlur}
                        isValid={hotelPropertyAddr1Valid.valid}
                        errorMessage={hotelPropertyAddr1Valid.message}
                      >
                        <input
                          className="no-label"
                          type="text"
                          value={hotelPropertyAddr2}
                          onChange={updateEntityAddress2}
                        />
                      </Textfield>

                      <Textfield
                        label="City"
                        wrapperClass="city"
                        inputValue={hotelPropertyCity}
                        inputOnChange={updateEntityCity}
                        inputRequired
                        inputOnBlur={entityCityOnBlur}
                        isValid={hotelPropertyCityValid.valid}
                        errorMessage={''}
                      />
                      <StateField
                        label="State"
                        inputValue={hotelPropertyState}
                        inputOnChange={updateEntityState}
                        inputRequired
                        isValid={hotelPropertyStateValid.valid}
                        errorMessage={''}
                      />
                      <Textfield
                        label="Zip"
                        wrapperClass="zip"
                        inputValue={hotelPropertyZip}
                        inputOnChange={updateEntityZip}
                        inputRequired
                        inputOnBlur={entityZipOnBlur}
                        isValid={hotelPropertyZipValid.valid}
                        errorMessage={''}
                      />

                      {(hotelPropertyCityValid.message ||
                        hotelPropertyStateValid.message ||
                        hotelPropertyZipValid.message) && (
                          <Fragment>
                            <p className="errMsg">
                              {[
                                hotelPropertyCityValid.message,
                                hotelPropertyStateValid.message,
                                hotelPropertyZipValid.message,
                              ]
                                .filter((i) => i)
                                .join(' ')}
                            </p>
                          </Fragment>
                        )}
                    </div>

                    <Textfield
                      label="Contact Name (Optional)"
                      wrapperClass="hotel-property-contact-name"
                      inputValue={hotelPropertyContactName}
                      inputOnChange={updateEntityContactName}
                    />
                    <Textfield
                      label="Contact Position (Optional)"
                      wrapperClass="hotel-property-contact-position"
                      inputValue={hotelPropertyContactTitle}
                      inputOnChange={updateEntityContactPosition}
                    />

                    <ContactInfoBlock
                      emailValue={hotelPropertyContactEmail}
                      emailOnChange={updateEntityEmail}
                      emailOnBlur={entityContactEmailOnBlur}
                      // emailValid={hotelPropertyContactEmailValid}
                      emailLabel="Email (Optional)"
                      telephoneValue={hotelPropertyContactPhone}
                      telephoneOnChange={updateEntityTelephone}
                      telephoneOnBlur={entityContactPhoneOnBlur}
                      telephoneValid={hotelPropertyContactPhoneValid}
                      extensionValue={hotelPropertyContactExt}
                      extensionOnChange={updateEntityExtension}
                      extensionOnBlur={entityContactExtensionOnBlur}
                      extensionValid={hotelPropertyContactExtValid}
                    />

                    <SingleCheckbox
                      label="Blacklist this Hotel"
                      wrapperClass="hotel-property-blacklist"
                      inputChecked={hotelPropertyBlacklistStatus}
                      inputOnChange={updateEntityIsBlacklisted}
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
                  inputValue={entity?.status == HOTELPROPERTYSTATUS.ARCHIVED ? 'Unarchive' : 'Save'}
                  inputOnClick={saveEntity}
                  inputDisabled={buttonDisabled}
                />

                {isDeletable && entity?.status != HOTELPROPERTYSTATUS.DRAFT && (
                  <SubmitButton
                    inputValue="Delete"
                    inputClass="delete"
                    inputOnClick={deleteEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}
                {!isDeletable &&
                  entity?.status != HOTELPROPERTYSTATUS.DRAFT &&
                  entity?.status != HOTELPROPERTYSTATUS.ARCHIVED && (
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
