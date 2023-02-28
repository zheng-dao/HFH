import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import SearchForm from '@components/SearchForm';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { HOTELCHAINSTATUS } from '@src/API';
import SystemEntityTable from '@components/SystemEntityTable';
import { DataStore } from '@aws-amplify/datastore';
import { HotelChain } from '@src/models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listHotelChains, searchHotelChains } from '@src/graphql/queries';
import { createHotelChain } from '@src/graphql/mutations';
import useDialog from '@contexts/DialogContext';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function HotelChainSystemPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    Object.values(HOTELCHAINSTATUS)
      // .map((val) => {
      //   return val;
      // })
      .filter((item) => item !== 'DRAFT' && item !== 'PENDING')
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

  const filterOptions = Object.values(HOTELCHAINSTATUS)
    .map((val) => {
      return {
        key: val,
        value: val,
      };
    })
    .filter((item) => item.key !== 'DRAFT' && item.key !== 'PENDING');

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
        new HotelChain({
          status: HOTELCHAINSTATUS.DRAFT,
        })
      ).then((item) => {
        router.push('/system/entities/hotel-chains/' + item.id);
      });
    } else {
      API.graphql(
        graphqlOperation(createHotelChain, { input: { status: HOTELCHAINSTATUS.DRAFT, name: '' } })
      )
        .then((results) => {
          setIsWaiting(false);
          router.push('/system/entities/hotel-chains/' + results.data.createHotelChain.id);
        })
        .catch(() => {
          setMessage('There was an error creating the Hotel Chain.');
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Hotel Chain',
        accessor: 'name',
        className: '',
      },
      {
        Header: 'Status',
        accessor: 'status',
        className: 'status-col',
        sortType: (a, b) => {
          let sortOrder = [HOTELCHAINSTATUS.ACTIVE, HOTELCHAINSTATUS.ARCHIVED];
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
      return API.graphql(graphqlOperation(searchHotelChains, variables));
    },
    [filterSelections, searchTerm]
  );

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        HotelChain,
        (h) => h.status('ne', HOTELCHAINSTATUS.DRAFT).status('ne', null),
        {
          page: currentPage,
          limit: 999999,
        }
      ).then((results) => {
        results.sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        let output = [];
        for (const result of results) {
          output.push({
            name: (
              <Link href={'/system/entities/hotel-chains/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_status: result.status,
            // status: HOTELCHAINSTATUS.ACTIVE,
            // raw_status: HOTELCHAINSTATUS.ACTIVE,
          });
        }
        setTableData(output);
      });
    } else {
      loadData().then((results) => {
        let output = [];
        setNextToken(results.data.searchHotelChains.nextToken);
        setTotalCount(results.data.searchHotelChains.total || 0);
        results.data.searchHotelChains.items.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        for (const result of results.data.searchHotelChains.items.filter(
          (item) => !item['_deleted']
        )) {
          output.push({
            name: (
              <Link href={'/system/entities/hotel-chains/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            status: (
              <span
                className={'status status-' + (result.status ? result.status.toLowerCase() : '')}
              >
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_status: result.status,
            // status: HOTELCHAINSTATUS.ACTIVE,
            // raw_status: HOTELCHAINSTATUS.ACTIVE,
          });
        }
        setInitialLoad(false);
        setTableData(output);
      });
    }
  }, [currentPage, loadData]);

  const loadMoreResults = (e) => {
    e.preventDefault();
    loadData(nextToken).then(async (results) => {
      let output = [];
      setNextToken(results.data.searchHotelChains.nextToken);
      results.data.searchHotelChains.items.sort((a, b) =>
        a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
      for (const result of results.data.searchHotelChains.items.filter(
        (item) => !item['_deleted']
      )) {
        output.push({
          name: (
            <Link href={'/system/entities/hotel-chains/' + result.id}>
              <a>{result.name}</a>
            </Link>
          ),
          status: (
            <span className={'status status-' + (result.status ? result.status.toLowerCase() : '')}>
              {result.status}
            </span>
          ),
          raw_name: result.name,
          raw_status: result.status,
          // status: HOTELCHAINSTATUS.ACTIVE,
          // raw_status: HOTELCHAINSTATUS.ACTIVE,
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
          <PageTitle prefix="System / " title="Hotel Chains" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <SearchForm
                title="Search Hotel Chains"
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
