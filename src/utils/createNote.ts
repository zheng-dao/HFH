import { NOTEACTION } from '@src/API';
import { Application, User, Note, Noteaction } from '@src/models';
import { DataStore } from '@aws-amplify/datastore';
import { API, graphqlOperation } from 'aws-amplify';
import { shouldUseDatastore } from './shouldUseDatastore';
import { createNote as createNoteMutation } from '@src/graphql/mutations';

export default async function createNote(
  message: string,
  action: Noteaction,
  application: Application,
  user: User
) {
  const ip = await API.get('Utils', '/utils/ip', {});
  const time = await API.get('Utils', '/utils/timestamp', {});

  if (shouldUseDatastore()) {
    // Not supported at this time.
    // return await DataStore.save(
    //   new Note({
    //     message: message,
    //     timestamp: time,
    //     remote_address: ip.ip,
    //     action: action,
    //     Application: application,
    //     noteApplicationId: application.id,
    //     User: user,
    //     noteUserId: user.id,
    //   })
    // );
  } else {
    return await API.graphql(
      graphqlOperation(createNoteMutation, {
        input: {
          message: message,
          timestamp: time,
          remote_address: ip.ip,
          action: action,
          noteApplicationId: application.id,
          noteUserId: user.id,
        },
      })
    );
  }
}
