import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listConfigurationSettings } from '@src/graphql/queries';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import { ConfigurationSetting } from '@src/models';

export default function UnauthenticatedSidebar() {
  const [instructions, setInstructions] = useState('');

  const CONFIG_NAME = 'user_login_instructions';

  useEffect(() => {
    if (shouldUseDatastore()) {
      // Unsupported.
    } else {
      API.graphql({
        query: listConfigurationSettings,
        variables: {
          filter: {
            name: {
              eq: CONFIG_NAME,
            },
          },
        },
        authMode: 'API_KEY',
      }).then((results) => {
        if (results.data.listConfigurationSettings.items) {
          setInstructions(
            deserializeModel(ConfigurationSetting, results.data.listConfigurationSettings.items[0])
          );
        }
      });
    }
  }, []);

  return (
    <div className="boundless sidebar">
      <div className="reading-block">
        <p dangerouslySetInnerHTML={{ __html: instructions.value }} />
      </div>
    </div>
  );
}
