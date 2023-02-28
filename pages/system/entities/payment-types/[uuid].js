import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { PaymentType, Stay } from '@src/models';
import { PAYMENTTYPESTATUS } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import Textareafield from '@components/Inputs/Textareafield';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getPaymentType, searchStays } from '@src/graphql/queries';
import { updatePaymentType, deletePaymentType } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import validateRequired from '@utils/validators/required';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function PaymentTypeEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [description, setDescription] = useState('');
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(PaymentType, uuid).then((item) => {
          setEntity(item);
          setName(item.name);
          checkIsArchivalbe(item.name);
          setDescription(item.description);
          setType(item.type);
        });
      } else {
        API.graphql(graphqlOperation(getPaymentType, { id: uuid }))
          .then((result) => {
            if (result.data.getPaymentType != null) {
              setEntity(deserializeModel(PaymentType, result.data.getPaymentType));
              setName(result.data.getPaymentType.name);
              checkIsArchivalbe(result.data.getPaymentType.name);
              setDescription(result.data.getPaymentType.description);
              setType(result.data.getPaymentType.type);
            } else {
              router.replace('/');
            }
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }
  }, [router.query, router]);

  // useEffect(() => {
  //   if (name) {
  //     setLoadingCounter((prev) => prev + 1);
  //     if (shouldUseDatastore()) {
  //       DataStore.query(Stay, (s) => s.payment_type('eq', name), { limit: 1 }).then((results) =>
  //         setIsDeletable(results.length == 0)
  //       );
  //     } else {
  //       API.graphql(graphqlOperation(searchStays, { filter: { payment_type: { eq: name } } }))
  //         .then((results) => {
  //           setIsDeletable(results.data.searchStays.items.length == 0 && name.length > 0);
  //         })
  //         .finally(() => setLoadingCounter((prev) => prev - 1));
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const checkIsArchivalbe = (name) => {
    if (name) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Stay, (s) => s.payment_type('eq', name), { limit: 1 }).then((results) =>
          setIsDeletable(results.length == 0)
        );
      } else {
        API.graphql(graphqlOperation(searchStays, { filter: { payment_type: { eq: name } } }))
          .then((results) => {
            setIsDeletable(results.data.searchStays.items.length === 0 && name.length > 0);
          })
          .finally(() => setLoadingCounter((prev) => prev - 1));
      }
    }
  }

  const title =
    entity?.status == PAYMENTTYPESTATUS.ACTIVE || entity?.status == PAYMENTTYPESTATUS.ARCHIVED
      ? 'Edit Payment Type'
      : 'New Payment Type';

  const updateEntityName = (e) => {
    setName(e.target.value);
  };

  const validateEntityName = (e) => {
    setNameValid(validateRequired(e.target.value));
  };

  const updateEntityDescription = (e) => {
    setDescription(e.target.value);
  };

  const isValidForm = () => {
    const localNameValid = validateRequired(name);
    setNameValid(localNameValid);
    return localNameValid.valid;
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
      const newPaymentType = PaymentType.copyOf(entity, (updated) => {
        (updated.status = PAYMENTTYPESTATUS.ACTIVE),
          (updated.name = name),
          (updated.description = description);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newPaymentType).then((item) => {
          setEntity(item);
          if (entity?.status == PAYMENTTYPESTATUS.ARCHIVED) {
            setMessage('Payment Type unarchived.');
          } else {
            setMessage('Payment Type saved.');
          }
          setTimeout(() => {
            router.push('/system/entities/payment-types');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = newPaymentType;
        API.graphql(graphqlOperation(updatePaymentType, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(PaymentType, results.data.updatePaymentType));
            if (entity?.status == PAYMENTTYPESTATUS.ARCHIVED) {
              setMessage('Payment Type unarchived.');
            } else {
              setMessage('Payment Type saved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/payment-types');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving this Payment Type.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete this payment type? This action cannot be un-done.')
    ) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(entity);
      } else {
        API.graphql(
          graphqlOperation(deletePaymentType, {
            input: { id: entity.id },
          })
        )
          .then(() => {
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/payment-types');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Payment Type.');
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
      const newPaymentType = PaymentType.copyOf(entity, (updated) => {
        (updated.status = PAYMENTTYPESTATUS.ARCHIVED), (updated.name = name), (updated.type = type);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newPaymentType).then((item) => {
          setEntity(item);
          setMessage('Payment Type archived.');
          setTimeout(() => {
            router.push('/system/entities/payment-types');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = newPaymentType;
        API.graphql(graphqlOperation(updatePaymentType, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(PaymentType, results.data.updatePaymentType));
            setMessage('Payment Type archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/payment-types');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Payment Type.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const shouldShowCancelWarning = () => {
    if (entity.status == PAYMENTTYPESTATUS.DRAFT) {
      if ((name && name.length > 0) || (description && description.length > 0)) {
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
        router.push('/system/entities/payment-types');
      }
    } else {
      router.push('/system/entities/payment-types');
    }
  };

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  const appPaneClassNames = classNames('primary', 'app-pane', {
    loading: loadingCounter > 0 || entity == null,
  });

  const appControlClassNames = classNames('app-controls', {
    loading: loadingCounter > 0 || entity == null,
  });

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
          <PageTitle prefix="System / " title="Payment Types" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-payment-type">
                    <Textfield
                      label="Name"
                      wrapperClass="payment-type-name"
                      inputValue={name}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={validateEntityName}
                      isValid={nameValid.valid}
                      errorMessage={nameValid.message}
                    />
                    <Textareafield
                      label="Description (Optional)"
                      withActualLabel={true}
                      wrapperClass="input-combo payment-type-description"
                      inputValue={description}
                      inputOnChange={updateEntityDescription}
                    />
                  </div>
                </form>
              </section>

              <div className={appControlClassNames}>
                <button className="cancel" onClick={cancelEntity} disabled={buttonDisabled}>
                  Cancel
                </button>

                {isDeletable &&
                  entity?.status != PAYMENTTYPESTATUS.DRAFT &&
                  entity?.status != PAYMENTTYPESTATUS.ARCHIVED && (
                    <SubmitButton
                      inputValue="Delete"
                      inputClass="delete"
                      inputOnClick={deleteEntity}
                      inputDisabled={buttonDisabled}
                    />
                  )}
                {!isDeletable &&
                  entity?.status != PAYMENTTYPESTATUS.DRAFT &&
                  entity?.status != PAYMENTTYPESTATUS.ARCHIVED && (
                    <SubmitButton
                      inputValue="Archive"
                      inputClass="archive"
                      inputOnClick={archiveEntity}
                      inputDisabled={buttonDisabled}
                    />
                  )}
                <SubmitButton
                  inputValue={entity?.status == PAYMENTTYPESTATUS.ARCHIVED ? 'Unarchive' : 'Save'}
                  inputClass="save"
                  inputOnClick={saveEntity}
                  inputDisabled={buttonDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
