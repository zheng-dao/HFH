import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { ConfigurationSetting } from '@src/models';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import SettingsValueBlock from '@components/CommonInputs/SettingsValueBlock';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listConfigurationSettings } from '@src/graphql/queries';
import { createConfigurationSetting, updateConfigurationSetting } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function SettingsEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [systemEmailAddress, setSystemEmailAddress] = useState(null);
  const [systemBccAddress, setSystemBccAddress] = useState(null);
  const [systemReplyToAddress, setSystemReplyToAddress] = useState(null);
  const [systemNumOpenAppsHomeScreen, setSystemNumOpenAppsHomeScreen] = useState(null);
  const [systemNumRecordsPaging, setSystemNumRecordsPaging] = useState(null);
  const [systemDaysBeforeCheckIn, setSystemDaysBeforeCheckIn] = useState(null);
  const [systemDaysAfterCheckout, setSystemDaysAfterCheckout] = useState(null);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const CONFIG_NAME = 'system_email_address';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemEmailAddress(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemEmailAddress(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemEmailAddress(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemEmailAddress(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    const CONFIG_NAME = 'system_bcc_address';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemBccAddress(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemBccAddress(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemBccAddress(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemBccAddress(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    const CONFIG_NAME = 'system_replyto_address';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemReplyToAddress(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemReplyToAddress(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemReplyToAddress(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemReplyToAddress(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    const CONFIG_NAME = 'num_open_apps_home_screen';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemNumOpenAppsHomeScreen(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemNumOpenAppsHomeScreen(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemNumOpenAppsHomeScreen(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemNumOpenAppsHomeScreen(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    const CONFIG_NAME = 'num_records_paging';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemNumRecordsPaging(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemNumRecordsPaging(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemNumRecordsPaging(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemNumRecordsPaging(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    const CONFIG_NAME = 'days_before_checkin_alert';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemDaysBeforeCheckIn(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemDaysBeforeCheckIn(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemDaysBeforeCheckIn(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemDaysBeforeCheckIn(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  useEffect(() => {
    const CONFIG_NAME = 'days_after_checkout_alert';
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setSystemDaysAfterCheckout(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setSystemDaysAfterCheckout(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setSystemDaysAfterCheckout(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setSystemDaysAfterCheckout(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  const updateSystemEmailAddressValue = (e) => {
    setSystemEmailAddress(
      ConfigurationSetting.copyOf(systemEmailAddress, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSystemBccAddressValue = (e) => {
    setSystemBccAddress(
      ConfigurationSetting.copyOf(systemBccAddress, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSystemReplyToAddressValue = (e) => {
    setSystemReplyToAddress(
      ConfigurationSetting.copyOf(systemReplyToAddress, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSystemNumOpenAppsHomeScreenValue = (e) => {
    setSystemNumOpenAppsHomeScreen(
      ConfigurationSetting.copyOf(systemNumOpenAppsHomeScreen, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSystemNumRecordsPagingValue = (e) => {
    setSystemNumRecordsPaging(
      ConfigurationSetting.copyOf(systemNumRecordsPaging, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSystemDaysBeforeCheckInValue = (e) => {
    setSystemDaysBeforeCheckIn(
      ConfigurationSetting.copyOf(systemDaysBeforeCheckIn, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSystemDaysAfterCheckoutValue = (e) => {
    setSystemDaysAfterCheckout(
      ConfigurationSetting.copyOf(systemDaysAfterCheckout, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const saveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (shouldUseDatastore()) {
      Promise.all([
        DataStore.save(systemEmailAddress).then((item) => setSystemEmailAddress(item)),
        DataStore.save(systemBccAddress).then((item) => setSystemBccAddress(item)),
        DataStore.save(systemReplyToAddress).then((item) => setSystemReplyToAddress(item)),
        DataStore.save(systemNumOpenAppsHomeScreen).then((item) =>
          setSystemNumOpenAppsHomeScreen(item)
        ),
        DataStore.save(systemNumRecordsPaging).then((item) => setSystemNumRecordsPaging(item)),
        DataStore.save(systemDaysBeforeCheckIn).then((item) => setSystemDaysBeforeCheckIn(item)),
        DataStore.save(systemDaysAfterCheckout).then((item) => setSystemDaysAfterCheckout(item)),
      ]).then(() => setMessage('Settings saved.'));
    } else {
      Promise.all([
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemEmailAddress),
          })
        ),
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemBccAddress),
          })
        ),
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemReplyToAddress),
          })
        ),
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemNumOpenAppsHomeScreen),
          })
        ),
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemNumRecordsPaging),
          })
        ),
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemDaysBeforeCheckIn),
          })
        ),
        API.graphql(
          graphqlOperation(updateConfigurationSetting, {
            input: removeUnwantedFields(systemDaysAfterCheckout),
          })
        ),
      ])
        .then(() => setMessage('Settings saved.'))
        .catch(() => setMessage('There was an error saving the Settings.'))
        .finally(() => {
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const removeUnwantedFields = (input) => {
    const { updatedAt, createdAt, ...objectToSave } = input;
    return objectToSave;
  };

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  const appPaneClassNames = classNames('primary', 'app-pane', {
    loading: loadingCounter > 0 || systemEmailAddress == null,
  });

  const appControlClassNames = classNames('app-controls', {
    loading: loadingCounter > 0 || systemEmailAddress == null,
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
          <PageTitle prefix="System / " title="Settings" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <SettingsValueBlock
                    title="System Email Address"
                    description="This is the email address that the system will send emails from."
                    label="System Email Address"
                    value={systemEmailAddress?.value}
                    onChange={updateSystemEmailAddressValue}
                  />

                  <SettingsValueBlock
                    title="BCC Email Address(es)"
                    description="Send carbon copies of all system emails. Separate email addresses with commas."
                    label="BCC Email Address(es)"
                    value={systemBccAddress?.value}
                    onChange={updateSystemBccAddressValue}
                  />

                  <SettingsValueBlock
                    title="Reply-to Email Address"
                    description="This is the reply-to email address that the system will send along with all emails."
                    label="Reply-to Email Address"
                    value={systemReplyToAddress?.value}
                    onChange={updateSystemReplyToAddressValue}
                  />

                  <SettingsValueBlock
                    title="Number of Open Applications on Home Screens"
                    description="This sets the number of applications shown in the Inbox and Open Applications areas for both Liaisons and Administrators."
                    label="Number of Open Applications on Home Screens"
                    value={systemNumOpenAppsHomeScreen?.value}
                    onChange={updateSystemNumOpenAppsHomeScreenValue}
                  />

                  <SettingsValueBlock
                    title="Number of Records for Applications Paging"
                    description="The number of records per page on the Applications results area."
                    label="Number of Records for Applications Paging"
                    value={systemNumRecordsPaging?.value}
                    onChange={updateSystemNumRecordsPagingValue}
                  />

                  <SettingsValueBlock
                    title="Days in Advance of Check In to Alert Admin"
                    description="This sets the number of days before check in that the system will alert the Administrator to take action."
                    label="Days in Advance of Check In to Alert Admin"
                    value={systemDaysBeforeCheckIn?.value}
                    onChange={updateSystemDaysBeforeCheckInValue}
                  />

                  <SettingsValueBlock
                    title="Days After Check Out to Alert Liaison"
                    description="This sets the number of days after check out that the system will alert the Liaison to take action."
                    label="Days After Check Out to Alert Liaison"
                    value={systemDaysAfterCheckout?.value}
                    onChange={updateSystemDaysAfterCheckoutValue}
                  />
                </form>
              </section>

              <div className={appControlClassNames}>
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
