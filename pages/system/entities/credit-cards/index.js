import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import SearchForm from '@components/SearchForm';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CARDSTATUS, CARDTYPE } from '@src/API';
import SystemEntityTable from '@components/SystemEntityTable';
import { DataStore } from '@aws-amplify/datastore';
import { Card } from '@src/models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listCards, searchCards } from '@src/graphql/queries';
import { createCard } from '@src/graphql/mutations';
import useDialog from '@contexts/DialogContext';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function CreditCardsSystemPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    Object.values(CARDSTATUS)
      .map((val) => {
        return val;
      })
      .filter((item) => item !== 'DRAFT')
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const { setMessage } = useDialog();
  const { setIsWaiting } = useButtonWait();
  const [initialLoad, setInitialLoad] = useState(true);

  const updateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterOptions = Object.values(CARDSTATUS)
    .map((val) => {
      return {
        key: val,
        value: val,
      };
    })
    .filter((item) => item.key !== 'DRAFT');

  const updateFilterSelections = (e) => {
    if (e.target.checked) {
      setFilterSelections([...filterSelections, e.target.value]);
    } else {
      setFilterSelections(filterSelections.filter((item) => item !== e.target.value));
    }
  };

  const addNewClick = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    if (shouldUseDatastore()) {
      DataStore.save(
        new Card({
          status: CARDSTATUS.DRAFT,
        })
      )
        .then((item) => {
          router.push('/system/entities/credit-cards/' + item.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      API.graphql(graphqlOperation(createCard, { input: { status: CARDSTATUS.DRAFT } }))
        .then((result) => {
          setIsWaiting(false);
          router.push('/system/entities/credit-cards/' + result.data.createCard.id);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setButtonDisabled(false);
          setIsWaiting(false);
          setMessage(
            'There was an error creating a new card. Please refresh the page and try again.'
          );
        });
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        className: '',
      },
      {
        Header: 'Card Type',
        accessor: 'type',
        className: '',
        sortType: (a, b) => {
          return a.values.type?.props?.children?.props?.children?.localeCompare(
            b.values.type?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        className: 'status-col',
        sortType: (a, b) => {
          let sortOrder = [CARDSTATUS.ACTIVE, CARDSTATUS.ARCHIVED];
          return (
            sortOrder.indexOf(a.values.status?.props?.children) -
            sortOrder.indexOf(b.values.status?.props?.children)
          );
        },
      },
    ],
    []
  );

  const initialTableState = {
    sortBy: [
      {
        id: 'name',
        desc: false,
      },
    ],
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState([]);

  const incrementPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const loadData = useCallback(
    (token) => {
      let filters = {};

      if (filterSelections) {
        filters.or = filterSelections.map((item) => {
          return { status: { eq: item } };
        });
      }

      if (searchTerm) {
        filters.and = {
          or: searchTerm
            .trim()
            .replace(/\s\s+/g, ' ')
            .split(' ')
            .map((item) => {
              return { name: { wildcard: '*' + item + '*' } };
            }),
        };
      }

      let variables = {
        filter: filters,
        sort: {
          field: 'name',
          direction: 'asc',
        },
      };
      if (token) {
        variables['nextToken'] = token;
      }
      return API.graphql(graphqlOperation(searchCards, variables));
    },
    [filterSelections, searchTerm]
  );

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(Card, (m) => m.status('ne', CARDSTATUS.DRAFT).status('ne', null), {
        page: currentPage,
        limit: 999999,
      }).then((results) => {
        results.sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        let output = [];
        for (const result of results) {
          output.push({
            name: (
              <Link href={'/system/entities/credit-cards/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            type: (
              <Link href={'/system/entities/payment-types/' + result.id}>
                <a>{result.type}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_type: result.type,
            raw_status: result.status,
          });
        }
        setTableData(output);
      });
    } else {
      loadData('').then((results) => {
        let output = [];
        setNextToken(results.data.searchCards.nextToken);
        setTotalCount(results.data.searchCards.total || 0);
        results.data.searchCards.items.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        for (const result of results.data.searchCards.items.filter((item) => !item['_deleted'])) {
          output.push({
            name: (
              <Link href={'/system/entities/credit-cards/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            type: (
              <Link href={'/system/entities/payment-types/' + result.id}>
                <a>{result.type}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_type: result.type,
            raw_status: result.status,
          });
        }
        setInitialLoad(false);
        setTableData(output);
      });
    }
  }, [currentPage, loadData]);

  const loadMoreResults = (e) => {
    e.preventDefault();
    loadData(nextToken).then((results) => {
      let output = [];
      setNextToken(results.data.searchCards.nextToken);
      results.data.searchCards.items.sort((a, b) =>
        a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
      for (const result of results.data.searchCards.items.filter((item) => !item['_deleted'])) {
        output.push({
          name: (
            <Link href={'/system/entities/credit-cards/' + result.id}>
              <a>{result.name}</a>
            </Link>
          ),
          type: (
            <Link href={'/system/entities/payment-types/' + result.id}>
              <a>{result.type}</a>
            </Link>
          ),
          status: (
            <span className={'status status-' + result.status.toLowerCase()}>{result.status}</span>
          ),
          raw_name: result.name,
          raw_type: result.type,
          raw_status: result.status,
        });
      }
      setTableData((prev) => prev.concat(output));
    });
  };

  const _tableDataMemo = useMemo(() => {
    return tableData;
    // .filter((item) => filterSelections.includes(item.raw_status))
    // .filter(
    //   (item) => searchTerm == '' || item.raw_name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
  }, [tableData]);

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();

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
              <SearchForm
                title="Search Credit Cards"
                searchTerm={searchTerm}
                onSearchChange={updateSearchTerm}
                filterOptions={filterOptions}
                filterSelection={filterSelections}
                onFilterChange={updateFilterSelections}
                addNewClick={addNewClick}
                addNewButtonDisabled={buttonDisabled}
              />

              <SystemEntityTable
                title={initialLoad ? 'Loading...' : totalCount + ' Results'}
                columns={tableColumns}
                initialTableState={initialTableState}
                data={_tableDataMemo}
                showPager={nextToken && nextToken.length > 0 && _tableDataMemo.length < totalCount}
                onPagerTrigger={loadMoreResults}
                pagerText={'(' + _tableDataMemo.length + ' of ' + totalCount + ')'}
                showLoader={initialLoad}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
