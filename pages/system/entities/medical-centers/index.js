import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import SearchForm from '@components/SearchForm';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { AFFILIATIONSTATUS, AFFILIATIONTYPE } from '@src/API';
import SystemEntityTable from '@components/SystemEntityTable';
import { DataStore } from '@aws-amplify/datastore';
import { Affiliation } from '@src/models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { State } from '@utils/states';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listAffiliations, searchAffiliations } from '@src/graphql/queries';
import { createAffiliation } from '@src/graphql/mutations';
import useDialog from '@contexts/DialogContext';
import useButtonWait from '@contexts/ButtonWaitContext';
import Selectfield from '@components/Inputs/Selectfield';

export default function MedicalCentersSystemPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    Object.values(AFFILIATIONSTATUS)
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

  const filterOptions = Object.values(AFFILIATIONSTATUS)
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
        new Affiliation({
          status: AFFILIATIONSTATUS.DRAFT,
          type: AFFILIATIONTYPE.MEDICALCENTER,
        })
      )
        .then((item) => {
          router.push('/system/entities/medical-centers/' + item.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      API.graphql(
        graphqlOperation(createAffiliation, {
          input: { status: AFFILIATIONSTATUS.DRAFT, type: AFFILIATIONTYPE.MEDICALCENTER, name: '' },
        })
      )
        .then((result) => {
          setIsWaiting(false);
          router.push('/system/entities/medical-centers/' + result.data.createAffiliation.id);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error creating a new Medical Center. Please refresh the page and try again.'
          );
          setButtonDisabled(false);
          setIsWaiting(false);
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
        Header: 'City',
        accessor: 'city',
        className: '',
        sortType: (a, b) => {
          return a.values.city?.props?.children?.props?.children?.localeCompare(
            b.values.city?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'State',
        accessor: 'state',
        className: '',
        sortType: (a, b) => {
          return a.values.state?.props?.children?.props?.children?.localeCompare(
            b.values.state?.props?.children?.props?.children,
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
          let sortOrder = [
            AFFILIATIONSTATUS.PENDING,
            AFFILIATIONSTATUS.ACTIVE,
            AFFILIATIONSTATUS.ARCHIVED,
          ];
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

      filters.type = { eq: AFFILIATIONTYPE.MEDICALCENTER };

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

      if (cityFilter) {
        filters.city = { eq: cityFilter?.value };
      }

      if (stateFilter) {
        filters.state = { eq: stateFilter?.value };
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
      return API.graphql(graphqlOperation(searchAffiliations, variables));
    },
    [filterSelections, searchTerm, cityFilter, stateFilter]
  );

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Affiliation,
        (m) =>
          m
            .status('ne', AFFILIATIONSTATUS.DRAFT)
            .status('ne', null)
            .type('eq', AFFILIATIONTYPE.MEDICALCENTER),
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
              <Link href={'/system/entities/medical-centers/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            city: (
              <Link href={'/system/entities/medical-centers/' + result.id}>
                <a>{result.city}</a>
              </Link>
            ),
            state: (
              <Link href={'/system/entities/medical-centers/' + result.id}>
                <a>{result.state}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_city: result.city,
            raw_state: result.state,
            raw_status: result.status,
          });
        }
        setTableData(output);
      });
    } else {
      loadData().then((results) => {
        let output = [];
        setNextToken(results.data.searchAffiliations.nextToken);
        setTotalCount(results.data.searchAffiliations.total || 0);
        results.data.searchAffiliations.items.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        for (const result of results.data.searchAffiliations.items) {
          output.push({
            name: (
              <Link href={'/system/entities/medical-centers/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            city: (
              <Link href={'/system/entities/medical-centers/' + result.id}>
                <a>{result.city}</a>
              </Link>
            ),
            state: (
              <Link href={'/system/entities/medical-centers/' + result.id}>
                <a>{result.state}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_city: result.city,
            raw_state: result.state,
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
    loadData(nextToken).then(async (results) => {
      let output = [];
      results.data.searchAffiliations.items.sort((a, b) =>
        a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
      setNextToken(results.data.searchAffiliations.nextToken);
      for (const result of results.data.searchAffiliations.items) {
        output.push({
          name: (
            <Link href={'/system/entities/medical-centers/' + result.id}>
              <a>{result.name}</a>
            </Link>
          ),
          city: (
            <Link href={'/system/entities/medical-centers/' + result.id}>
              <a>{result.city}</a>
            </Link>
          ),
          state: (
            <Link href={'/system/entities/medical-centers/' + result.id}>
              <a>{result.state}</a>
            </Link>
          ),
          status: (
            <span className={'status status-' + result.status.toLowerCase()}>{result.status}</span>
          ),
          raw_name: result.name,
          raw_city: result.city,
          raw_state: result.state,
          raw_status: result.status,
        });
      }
      let data = tableData.concat(output);
      data.sort((a, b) =>
        a.name?.props?.children?.props?.children.localeCompare(
          b.name?.props?.children?.props?.children,
          undefined,
          { sensitivity: 'base' }
        )
      );
      setTableData(data);
    });
  };

  const _tableDataMemo = useMemo(() => {
    return tableData;
    // .filter((item) => filterSelections.includes(item.raw_status))
    // .filter(
    //   (item) => searchTerm == '' || item.raw_name.toLowerCase().includes(searchTerm.toLowerCase())
    // )
    // .filter((item) => stateFilter == '' || item.raw_state == stateFilter)
    // .filter((item) => cityFilter == '' || item.raw_city == cityFilter);
  }, [tableData]);

  const updateStateFilter = (e) => {
    setStateFilter(e);
  };

  const updateCityFilter = (e) => {
    setCityFilter(e);
  };

  const cities = useMemo(() => {
    const raw_cities = tableData
      .map((item) => item.raw_city)
      .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
      .filter((item) => item !== null);
    return [...new Set(raw_cities)];
  }, [tableData]);

  const additionalFilterOptions = [
    <Selectfield
      key="cities-filter"
      useReactSelect
      useRegularSelect={false}
      options={cities.map((item) => {
        return { value: item, label: item };
      })}
      placeholder="City..."
      blankValue=""
      inputValue={cityFilter}
      inputOnChange={updateCityFilter}
    />,
    <Selectfield
      key="state-filter"
      useReactSelect
      useRegularSelect={false}
      options={new State().getStatesOfCountry('US').map((item) => {
        return { value: item.name, label: item.name + ' (' + item.isoCode + ')' };
      })}
      placeholder="State..."
      blankValue=""
      inputValue={stateFilter}
      inputOnChange={updateStateFilter}
    />,
  ];

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
          <PageTitle prefix="System / " title="Medical Centers" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <SearchForm
                title="Search Medical Centers"
                searchTerm={searchTerm}
                onSearchChange={updateSearchTerm}
                filterOptions={filterOptions}
                filterSelection={filterSelections}
                onFilterChange={updateFilterSelections}
                addNewClick={addNewClick}
                additionalFilters={additionalFilterOptions}
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
