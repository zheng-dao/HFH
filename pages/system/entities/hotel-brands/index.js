import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import SearchForm from '@components/SearchForm';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { HOTELBRANDSTATUS, HOTELCHAINSTATUS } from '@src/API';
import SystemEntityTable from '@components/SystemEntityTable';
import { DataStore } from '@aws-amplify/datastore';
import { HotelBrand, HotelChain } from '@src/models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  listHotelBrands,
  searchHotelChains,
  listHotelChains,
  getHotelChain,
} from '@src/graphql/queries';
import { createHotelBrand } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import { listHotelBrandsWithRelationships } from '@src/customQueries/listHotelBrandsWithRelationships';
import { searchHotelBrands } from '@src/customQueries/searchHotelBrandsWithRelationships';
import useButtonWait from '@contexts/ButtonWaitContext';
import Selectfield from '@components/Inputs/Selectfield';

export default function HotelBrandSystemPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [filterSelections, setFilterSelections] = useState(
    Object.values(HOTELBRANDSTATUS)
      .map((val) => {
        return val;
      })
      .filter((item) => item !== 'DRAFT' && item !== 'PENDING')
  );
  const [nextToken, setNextToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const { setMessage } = useDialog();
  const { setIsWaiting } = useButtonWait();
  const [initialLoad, setInitialLoad] = useState(true);

  const updateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterOptions = Object.values(HOTELBRANDSTATUS)
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
        new HotelBrand({
          status: HOTELBRANDSTATUS.DRAFT,
        })
      )
        .then((item) => {
          router.push('/system/entities/hotel-brands/' + item.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      API.graphql(
        graphqlOperation(createHotelBrand, { input: { status: HOTELBRANDSTATUS.DRAFT, name: '' } })
      )
        .then((results) => {
          setIsWaiting(false);
          router.push('/system/entities/hotel-brands/' + results.data.createHotelBrand.id);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'An error occurred creating a new Hotel Brand. Please refresh the page and try again.'
          );
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Hotel Brand',
        accessor: 'name',
        className: '',
      },
      {
        Header: 'Hotel Chain',
        accessor: 'chain',
        className: '',
        sortType: (a, b) => {
          return a.values.chain?.props?.children?.props?.children?.localeCompare(
            b.values.chain?.props?.children?.props?.children,
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
          let sortOrder = [HOTELBRANDSTATUS.ACTIVE, HOTELBRANDSTATUS.ARCHIVED];
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

      if (chainFilter) {
        filters.hotelBrandHotelChainId = { eq: chainFilter?.value };
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
      return API.graphql(graphqlOperation(searchHotelBrands, variables));
    },
    [filterSelections, searchTerm, chainFilter]
  );

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        HotelBrand,
        (h) => h.status('ne', HOTELBRANDSTATUS.DRAFT).status('ne', null),
        {
          page: currentPage,
          limit: 999999,
        }
      ).then((results) => {
        let output = [];
        results.sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        for (const result of results) {
          output.push({
            name: (
              <Link href={'/system/entities/hotel-brands/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            chain: (
              <Link href={'/system/entities/hotel-brands/' + result.id}>
                <a>{result.HotelChain?.name}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_chain: result.HotelChain?.name,
            raw_status: result.status,
          });
        }
        setTableData(output);
      });
    } else {
      loadData().then(async (results) => {
        let output = [];
        setNextToken(results.data.searchHotelBrands.nextToken);
        setTotalCount(results.data.searchHotelBrands.total || 0);
        results.data.searchHotelBrands.items.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        for (const result of results.data.searchHotelBrands.items.filter(
          (item) => !item['_deleted']
        )) {
          if (result.HotelChain?.name) {
            output.push({
              name: (
                <Link href={'/system/entities/hotel-brands/' + result.id}>
                  <a>{result.name}</a>
                </Link>
              ),
              chain: (
                <Link href={'/system/entities/hotel-brands/' + result.id}>
                  <a>{result.HotelChain?.name}</a>
                </Link>
              ),
              status: (
                <span className={'status status-' + result.status.toLowerCase()}>
                  {result.status}
                </span>
              ),
              raw_name: result.name,
              raw_chain: result.HotelChain?.name,
              raw_status: result.status,
            });
          } else {
            if (result.hotelBrandHotelChainId) {
              const chain = await API.graphql(
                graphqlOperation(getHotelChain, { id: result.hotelBrandHotelChainId })
              );
              output.push({
                name: (
                  <Link href={'/system/entities/hotel-brands/' + result.id}>
                    <a>{result.name}</a>
                  </Link>
                ),
                chain: (
                  <Link href={'/system/entities/hotel-brands/' + result.id}>
                    <a>{chain.data.getHotelChain?.name}</a>
                  </Link>
                ),
                status: (
                  <span className={'status status-' + result.status.toLowerCase()}>
                    {result.status}
                  </span>
                ),
                raw_name: result.name,
                raw_chain: chain.data.getHotelChain?.name,
                raw_status: result.status,
              });
            } else {
              output.push({
                name: (
                  <Link href={'/system/entities/hotel-brands/' + result.id}>
                    <a>{result.name}</a>
                  </Link>
                ),
                chain: (
                  <Link href={'/system/entities/hotel-brands/' + result.id}>
                    <a></a>
                  </Link>
                ),
                status: (
                  <span className={'status status-' + result.status.toLowerCase()}>
                    {result.status}
                  </span>
                ),
                raw_name: result.name,
                raw_chain: '',
                raw_status: result.status,
              });
            }
          }
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
      setNextToken(results.data.searchHotelBrands.nextToken);
      for (const result of results.data.searchHotelBrands.items.filter(
        (item) => !item['_deleted']
      )) {
        if (result.HotelChain?.name) {
          output.push({
            name: (
              <Link href={'/system/entities/hotel-brands/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            chain: (
              <Link href={'/system/entities/hotel-brands/' + result.id}>
                <a>{result.HotelChain?.name}</a>
              </Link>
            ),
            status: (
              <span className={'status status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            ),
            raw_name: result.name,
            raw_chain: result.HotelChain?.name,
            raw_status: result.status,
          });
        } else {
          if (result.hotelBrandHotelChainId) {
            const chain = await API.graphql(
              graphqlOperation(getHotelChain, { id: result.hotelBrandHotelChainId })
            );
            console.log('Found chain', chain);
            output.push({
              name: (
                <Link href={'/system/entities/hotel-brands/' + result.id}>
                  <a>{result.name}</a>
                </Link>
              ),
              chain: (
                <Link href={'/system/entities/hotel-brands/' + result.id}>
                  <a>{chain.data.getHotelChain?.name}</a>
                </Link>
              ),
              status: (
                <span className={'status status-' + result.status.toLowerCase()}>
                  {result.status}
                </span>
              ),
              raw_name: result.name,
              raw_chain: chain.data.getHotelChain?.name,
              raw_status: result.status,
            });
          }
        }
      }
      let data = tableData.concat(output);
      data.sort((a, b) => a.raw_name.localeCompare(b.raw_name, undefined, { sensitivity: 'base' }));
      setTableData(data);
    });
  };

  const _tableDataMemo = useMemo(() => {
    return tableData;
    // .filter((item) => filterSelections.includes(item.raw_status))
    // .filter(
    //   (item) => searchTerm == '' || item.raw_name.toLowerCase().includes(searchTerm.toLowerCase())
    // )
    // .filter((item) => chainFilter == '' || item.raw_chain == chainFilter);
  }, [tableData]);

  const [chains, setChains] = useState([]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelChain, (c) => c.status('ne', HOTELCHAINSTATUS.DRAFT), {
        page: 0,
        limit: 999999,
      }).then((items) => {
        setChains(items);
      });
    } else {
      API.graphql(
        graphqlOperation(listHotelChains, {
          limit: 100000,
          filter: { status: { ne: HOTELCHAINSTATUS.DRAFT } },
        })
      ).then((results) => {
        if (results.data.listHotelChains.items.length > 0) {
          const hotelChains = results.data.listHotelChains.items.sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          const archivedChains = hotelChains
            .filter((item) => item.status === HOTELCHAINSTATUS.ARCHIVED)
            .map((item) => deserializeModel(HotelChain, item));
          const activeChains = hotelChains
            .filter((item) => item.status === HOTELCHAINSTATUS.ACTIVE)
            .map((item) => deserializeModel(HotelChain, item));
          setChains([...activeChains, ...archivedChains]);
        }
      });
    }
  }, []);

  const updateChainFilter = (e) => {
    setChainFilter(e);
  };

  const additionalFilterOptions = [
    <Selectfield
      key="chains-filter"
      useReactSelect
      useRegularSelect={false}
      options={chains.map((item) => {
        if (item.status === HOTELCHAINSTATUS.ARCHIVED) {
          return { value: item.id, label: `ARCHIVED - ${item.name}` };
        }
        return { value: item.id, label: item.name };
      })}
      placeholder="Hotel Chain..."
      blankValue=""
      inputValue={chainFilter}
      inputOnChange={updateChainFilter}
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
          <PageTitle prefix="System / " title="Hotel Brands" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <SearchForm
                title="Search Hotel Brands"
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
