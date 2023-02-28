import { User } from '@src/models';
import { API, graphqlOperation } from 'aws-amplify';
import { searchUsers, usersByEmail } from '@src/graphql/queries';
import { USERSTATUS } from '@src/API';
import { deserializeModel } from '@aws-amplify/datastore/ssr';

export default function lookupUser(email) {
  // We can't rely on datastore to be populated this early in the request.
  return new Promise((resolve, reject) => {
    API.graphql(graphqlOperation(usersByEmail, { username: email }))
      .then((results) => {
        if (results?.data?.UsersByEmail?.items && results?.data?.UsersByEmail?.items.length > 0) {
          const actualResults = results.data.UsersByEmail.items.filter((item) => !item['_deleted']);
          if (actualResults.length > 0) {
            resolve([deserializeModel(User, actualResults[0])]);
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
