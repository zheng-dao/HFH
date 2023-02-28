import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Group } from '@src/models';
import { GROUPSTATUS } from '@src/API';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import Selectfield from '@components/Inputs/Selectfield';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getGroup, searchApplications } from '@src/graphql/queries';
import { updateGroup, deleteGroup } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function GroupEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [isArchivable, setIsArchivable] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Group, uuid).then((item) => {
          setEntity(item);
          setName(item.name);
        });
      } else {
        API.graphql(graphqlOperation(getGroup, { id: uuid }))
          .then((results) => {
            if (results.data.getGroup != null) {
              setEntity(deserializeModel(Group, results.data.getGroup));
              setName(results.data.getGroup.name);
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
    if (router.query.uuid) {
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        // Unsupported.
      } else {
        API.graphql(
          graphqlOperation(searchApplications, {
            filter: { applicationGroupId: { eq: router.query.uuid } },
          })
        )
          .then((results) => {
            if (
              results.data.searchApplications.items &&
              results.data.searchApplications.items.length > 0
            ) {
              setIsArchivable(true);
              setIsDeletable(false);
            } else {
              setIsArchivable(false);
              setIsDeletable(true);
            }
          })
          .finally(() => {
            setLoadingCounter((prev) => prev - 1);
          });
      }
    }
  }, [router.query.uuid]);

  const title =
    entity?.status == GROUPSTATUS.ACTIVE || entity?.status == GROUPSTATUS.ARCHIVED
      ? 'Edit Group'
      : 'New Group';

  const updateEntityName = (e) => {
    setName(e.target.value);
  };

  const entityNameOnBlur = (e) => {
    setNameValid(validateRequired(e.target.value));
  };

  const saveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (!validateRequired(name).valid) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newGroup = Group.copyOf(entity, (updated) => {
        (updated.status = GROUPSTATUS.ACTIVE), (updated.name = name);
      });
      if (shouldUseDatastore()) {
        DataStore.save(newGroup).then((item) => {
          setEntity(item);
          setMessage('Group saved.');
          setTimeout(() => {
            router.push('/system/entities/groups');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, creator, ...objectToSave } =
          newGroup;
        API.graphql(graphqlOperation(updateGroup, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(Group, results.data.updateGroup));
            setMessage('Group saved.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/groups');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error saving this Group.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const deleteEntity = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this group? This action cannot be un-done.')) {
      setButtonDisabled(true);
      setIsWaiting(true);
      if (shouldUseDatastore()) {
        DataStore.delete(entity);
        setMessage('Group deleted.');
        setTimeout(() => {
          router.push('/system/entities/groups');
        }, 1500);
      } else {
        API.graphql(graphqlOperation(deleteGroup, { input: { id: entity.id } }))
          .then(() => {
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/groups');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error deleting this Group.');
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
    if (!validateRequired(name).valid) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newGroup = Group.copyOf(entity, (updated) => {
        (updated.status = GROUPSTATUS.ARCHIVED), (updated.name = name);
      });
      if (shouldUseDatastore()) {
        DataStore.save(
          Group.copyOf(entity, (updated) => {
            (updated.status = GROUPSTATUS.ARCHIVED), (updated.name = name);
          })
        ).then((item) => {
          setEntity(item);
          setMessage('Group archived.');
          setTimeout(() => {
            router.push('/system/entities/groups');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, creator, ...objectToSave } =
          newGroup;
        API.graphql(graphqlOperation(updateGroup, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(Group, results.data.updateGroup));
            setMessage('Group archived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/groups');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error archiving this Group.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const activateEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (!validateRequired(name).valid) {
      setMessage('Required information is missing. Please review the information.');
      setButtonDisabled(false);
      setIsWaiting(false);
    } else {
      const newGroup = Group.copyOf(entity, (updated) => {
        (updated.status = GROUPSTATUS.ACTIVE), (updated.name = name);
      });
      if (shouldUseDatastore()) {
        DataStore.save(
          Group.copyOf(entity, (updated) => {
            (updated.status = GROUPSTATUS.ACTIVE), (updated.name = name);
          })
        ).then((item) => {
          setEntity(item);
          setMessage('Group unarchived.');
          setTimeout(() => {
            router.push('/system/entities/groups');
          }, 1500);
        });
      } else {
        const { createdAt, updatedAt, _deleted, _lastChangedAt, creator, ...objectToSave } =
          newGroup;
        API.graphql(graphqlOperation(updateGroup, { input: objectToSave }))
          .then((results) => {
            setEntity(deserializeModel(Group, results.data.updateGroup));
            setMessage('Group unarchived.');
            setIsWaiting(false);
            setTimeout(() => {
              router.push('/system/entities/groups');
            }, 1500);
          })
          .catch(() => {
            setMessage('There was an error activating this Group.');
            setButtonDisabled(false);
            setIsWaiting(false);
          });
      }
    }
  };

  const shouldShowCancelWarning = () => {
    if (entity.status == GROUPSTATUS.DRAFT) {
      if (name && name.length > 0) {
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
        router.push('/system/entities/groups');
      }
    } else {
      router.push('/system/entities/groups');
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
          <PageTitle prefix="System / " title="Groups" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>{title}</h2>

                  <div className="add-new-group">
                    <Textfield
                      label="Name"
                      wrapperClass="credit-card-name"
                      inputValue={name}
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
                <button className="cancel" onClick={cancelEntity} disabled={buttonDisabled}>
                  Cancel
                </button>

                {isDeletable && entity?.status != GROUPSTATUS.DRAFT && (
                  <SubmitButton
                    inputValue="Delete"
                    inputClass="delete"
                    inputOnClick={deleteEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}

                {isArchivable && 
                entity?.status != GROUPSTATUS.DRAFT &&
                entity?.status !== GROUPSTATUS.ARCHIVED && (
                  <SubmitButton
                    inputValue="Archive"
                    inputClass="archive"
                    inputOnClick={archiveEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}

                {entity?.status == GROUPSTATUS.ARCHIVED && (
                  <SubmitButton
                    inputValue="Unarchive"
                    inputClass="activate"
                    inputOnClick={activateEntity}
                    inputDisabled={buttonDisabled}
                  />
                )}
                <SubmitButton
                  inputValue="Save"
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
