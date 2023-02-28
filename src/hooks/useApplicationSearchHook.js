import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { searchApplications } from '@src/graphql/queries';

const useApplicationSearchHook = (filter, sort, limit, page) => {
  const [currentSort, setCurrentSort] = useState('');
  const [applications, setApplications] = useState([]);
  const [nextToken, setNextToken] = useState('');

  useEffect(() => {
    API.graphql(
      graphqlOperation(searchApplications, {
        limit,
      })
    ).then((results) => {
      console.log('Results are', results);
    });
  }, []);

  useEffect(() => {
    if (sort != currentSort) {
      setApplications([]);
      setCurrentSort(sort);
      setNextToken('');
    }
  }, [sort]);
};

export default useApplicationSearchHook;
