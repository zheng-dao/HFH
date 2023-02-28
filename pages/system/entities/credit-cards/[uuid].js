import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Card, Stay } from '@src/models';
import { CARDSTATUS, CARDTYPE } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import Selectfield from '@components/Inputs/Selectfield';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getCard, searchStays } from '@src/graphql/queries';
import { updateCard, deleteCard } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function CardEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [typeValid, setTypeValid] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Card, uuid).then((item) => {
          setEntity(item);
          setName(item.name);
          setType(item.type);
        });
      } else {
        API.graphql(graphqlOperation(getCard, { id: uuid }))
          .then((results) => {
            if (results.data.getCard != null) {
              setEntity(deserializeModel(Card, results.data.getCard));
              checkIsArchivalbe(results.data.getCard.name);
              setName(results.data.getCard.name);
              setType(results.data.getCard.type);
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

  const checkIsArchivalbe = (name) => {
    if (name) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Stay, (s) => s.card('eq', uuid), { limit: 1 }).then((results) => {
          setIsDeletable(results.length == 0);
        });
      } else {
        API.graphql(graphqlOperation(searchStays, { filter: { card: { eq: name } } }))
          .then((results) => {
            setIsDeletable(results.data.searchStays.items.length === 0);
          })
          .finally(() => {
            setLoadingCounter((prev) => prev - 1);
          });
      }
    }
  }

  const title =
    entity?.status == CARDSTATUS.ACTIVE || entity?.status == CARDSTATUS.ARCHIVED
      ? 'Edit Credit Card'
      : 'New Credit Card';

  const updateEntityName = (e) => {
    setName(e.target.value);
  };

  const entityNameOnBlur = (e) => {
    setNameValid(validateRequired(e.target.value));
  };

  const updateEntityType = (e) => {
    setType(e);
    setTypeValid(validateRequired(e));
  };

  const saveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    const localNameValid = validateRequired(name);
    setNameValid(localNameValid);
    if (!localNameValid.valid) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const cardToSave = Card.copyOf(entity, (updated) => {
        (updated.status = CARDSTATUS.ACTIVE), (updated.name = name), (updated.type = type?.value);
      });
      if (shouldUseDatastore()) {
        DataStore.save(cardToSave).then((item) => {
          setEntity(item);
          if (entity?.status == CARDSTATUS.ARCHIVED) {
            setMessage('Credit Card unarchived.');
          } else {
            setMessage('Credit Card saved.');
          }
          setTimeout(() => {
            router.push('/system/entities/credit-cards');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = cardToSave;
        API.graphql(graphqlOperation(updateCard, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(Card, results.data.updateCard));
            if (entity?.status == CARDSTATUS.ARCHIVED) {
              setMessage('Credit Card unarchived.');
            } else {
              setMessage('Credit Card saved.');
            }
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/credit-cards');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving the information.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this card? This action cannot be un-done.')) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(entity);
        setMessage('Credit Card deleted.');
        setTimeout(() => {
          router.push('/system/entities/credit-cards');
        }, 1500);
      } else {
        API.graphql(graphqlOperation(deleteCard, { input: { id: entity.id } })).finally(() => {
          setIsWaiting(false);
        });
        setTimeout(() => {
          router.push('/system/entities/credit-cards');
        }, 1500);
      }
    }
  };

  const archiveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    const localNameValid = validateRequired(name);
    setNameValid(localNameValid);
    if (!localNameValid.valid) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const cardToSave = Card.copyOf(entity, (updated) => {
        (updated.status = CARDSTATUS.ARCHIVED), (updated.name = name), (updated.type = type?.value);
      });
      if (shouldUseDatastore()) {
        DataStore.save(cardToSave).then((item) => {
          setEntity(item);
          setMessage('Credit Card archived.');
          setTimeout(() => {
            router.push('/system/entities/credit-cards');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } = cardToSave;
        API.graphql(graphqlOperation(updateCard, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(Card, results.data.updateCard));
            setMessage('Credit Card archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/credit-cards');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving the information.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const shouldShowCancelWarning = () => {
    if (entity.status == CARDSTATUS.DRAFT) {
      if ((name && name.length > 0) || type?.value) {
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
        router.push('/system/entities/credit-cards');
      }
    } else {
      router.push('/system/entities/credit-cards');
    }
  };

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  const appPaneClasses = classNames('primary', 'app-pane', {
    loading: loadingCounter > 0 || entity == null,
  });

  const appControlClasses = classNames('app-controls', {
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
          <PageTitle prefix="System / " title="Credit Cards" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClasses}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-credit-card">
                    <Textfield
                      label="Name"
                      wrapperClass="credit-card-type"
                      inputValue={name}
                      inputOnChange={updateEntityName}
                      inputRequired
                      inputOnBlur={entityNameOnBlur}
                      isValid={nameValid.valid}
                      errorMessage={nameValid.message}
                    />
                    <Selectfield
                      label="Credit Card Type (Optional)"
                      wrapperClass="credit-card-type"
                      inputValue={type}
                      inputOnChange={updateEntityType}
                      options={CARDTYPE}
                      // inputRequired
                      blankValue=""
                      useReactSelect
                      useRegularSelect={false}
                      placeholder="Select Card..."
                    // isValid={typeValid.valid}
                    // errorMessage={typeValid.message}
                    />
                  </div>
                </form>
              </section>

              <div className={appControlClasses}>
                <button className="cancel" onClick={cancelEntity} disabled={buttonDisabled}>
                  Cancel
                </button>

                {isDeletable && entity?.status != CARDSTATUS.DRAFT && (
                  <SubmitButton
                    inputValue="Delete"
                    inputClass="delete"
                    inputOnClick={deleteEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}
                {!isDeletable &&
                  entity?.status != CARDSTATUS.DRAFT &&
                  entity?.status != CARDSTATUS.ARCHIVED && (
                    <SubmitButton
                      inputValue="Archive"
                      inputClass="archive"
                      inputOnClick={archiveEntity}
                      inputDisabled={buttonDisabled}
                    />
                  )}
                <SubmitButton
                  inputValue={entity?.status == CARDSTATUS.ARCHIVED ? 'Unarchive' : 'Save'}
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
