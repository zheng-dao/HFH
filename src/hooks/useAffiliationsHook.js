import { useEffect, useState } from 'react';
import { DataStore } from 'aws-amplify';
import { Affiliation } from '@src/models';
import { AFFILIATIONTYPE, AFFILIATIONSTATUS } from '@src/API';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import useDialog from '@contexts/DialogContext';
import { listAffiliations, searchAffiliations } from '@src/graphql/queries';

const useAffiliationsHook = (type, includePending, includeArchiving) => {
  const [affiliations, setAffiliations] = useState([]);

  const { setMessage } = useDialog();

  const statusToInclude = includePending
    ? [{ status: { eq: AFFILIATIONSTATUS.PENDING } }, { status: { eq: AFFILIATIONSTATUS.ACTIVE } }]
    : includeArchiving
      ? [{ status: { eq: AFFILIATIONSTATUS.ARCHIVED } }, { status: { eq: AFFILIATIONSTATUS.ACTIVE } }] : [{ status: { eq: AFFILIATIONSTATUS.ACTIVE } }];

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(Affiliation, (c) =>
        c
          .type('eq', type)
          .or((c) =>
            c.status('eq', AFFILIATIONSTATUS.PENDING).status('eq', AFFILIATIONSTATUS.ACTIVE)
          )
      ).then((affiliations) => {
        setAffiliations(
          affiliations.map((aff) => {
            return {
              key: aff.id,
              value: (aff.status == AFFILIATIONSTATUS.PENDING ? 'PENDING - ' : '') + aff.name,
            };
          })
        );
      });
    } else {
      API.graphql(
        graphqlOperation(searchAffiliations, {
          filter: {
            type: { eq: type },
            or: statusToInclude,
          },
          limit: 999,
        })
      )
        .then((results) => {
          setAffiliations(
            results.data.searchAffiliations.items
              .sort((a, b) =>
                a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
              )
              .map((aff) => {
                return {
                  value: aff.id,
                  label: (aff.status == AFFILIATIONSTATUS.PENDING ? 'PENDING - ' : '') + aff.name,
                };
              })
          );
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error loading Affiliations. Please reload the page and try again.'
          );
        });
    }
  }, []);

  return affiliations;
};

export default useAffiliationsHook;
