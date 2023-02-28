import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import SearchForm from '@components/SearchForm';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { HOTELBRANDSTATUS, HOTELCHAINSTATUS, HOTELPROPERTYSTATUS } from '@src/API';
import SystemEntityTable from '@components/SystemEntityTable';
import { DataStore } from '@aws-amplify/datastore';
import { HotelBrand, HotelChain, HotelProperty } from '@src/models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { State } from '@utils/states';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listHotelProperties, listHotelBrands, listHotelChains } from '@src/graphql/queries';
import { searchHotelProperties } from '@src/customQueries/searchHotelPropertiesWithRelationships';
import { listHotelPropertiesWithRelationships } from '@src/customQueries/listHotelPropertiesWithRelationships';
import { createHotelProperty } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import useButtonWait from '@contexts/ButtonWaitContext';
import Selectfield from '@components/Inputs/Selectfield';

export default function HotelPropertiesSystemPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    Object.values(HOTELPROPERTYSTATUS)
      .map((val) => {
        return val;
      })
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

  const filterOptions = Object.values(HOTELPROPERTYSTATUS)
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
        new HotelProperty({
          status: HOTELPROPERTYSTATUS.DRAFT,
          is_blacklist: false,
        })
      )
        .then((item) => {
          router.push('/system/entities/hotel-properties/' + item.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      API.graphql(
        graphqlOperation(createHotelProperty, {
          input: { status: HOTELPROPERTYSTATUS.DRAFT, is_blacklist: false, name: '' },
        })
      )
        .then((results) => {
          setIsWaiting(false);
          router.push('/system/entities/hotel-properties/' + results.data.createHotelProperty.id);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error creating the Hotel Property. Please refresh the page and try again.'
          );
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Hotel Property',
        accessor: 'name',
        className: '',
      },
      {
        Header: 'Hotel Brand',
        accessor: 'brand',
        className: '',
        sortType: (a, b) => {
          return a.values.brand?.props?.children?.props?.children?.localeCompare(
            b.values.brand?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
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
          let sortOrder = [
            HOTELPROPERTYSTATUS.ACTIVE,
            HOTELPROPERTYSTATUS.BLACKLISTED,
            HOTELPROPERTYSTATUS.ARCHIVED,
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
        filters.HotelChainID = { eq: chainFilter?.value };
      }

      if (brandFilter) {
        filters.HotelBrandID = { eq: brandFilter?.value };
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
      return API.graphql(graphqlOperation(searchHotelProperties, variables));
    },
    [filterSelections, searchTerm, chainFilter, brandFilter, stateFilter]
  );

  useEffect(() => {
    let canceled = false;
    if (shouldUseDatastore()) {
      DataStore.query(
        HotelProperty,
        (h) => h.status('ne', HOTELPROPERTYSTATUS.DRAFT).status('ne', null),
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
              <Link href={'/system/entities/hotel-properties/' + result.id}>
                <a>{result.name}</a>
              </Link>
            ),
            brand: (
              <Link href={'/system/entities/hotel-properties/' + result.id}>
                <a>{result.HotelBrand?.name}</a>
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
            raw_brand: result.HotelBrand?.name,
            raw_chain: result.HotelChain?.name,
            raw_status: result.status,
            raw_state: result.state,
          });
        }
        setTableData(output);
      });
    } else {
      loadData().then((results) => {
        if (!canceled) {
          let output = [];
          setNextToken(results.data.searchHotelProperties.nextToken);
          setTotalCount(results.data.searchHotelProperties.total || 0);
          results.data.searchHotelProperties.items.sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          for (const result of results.data.searchHotelProperties.items.filter(
            (item) => !item['_deleted']
          )) {
            output.push({
              name: (
                <Link href={'/system/entities/hotel-properties/' + result.id}>
                  <a>{result.name}</a>
                </Link>
              ),
              brand: (
                <Link href={'/system/entities/hotel-properties/' + result.id}>
                  <a>{result.HotelBrand?.name}</a>
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
              raw_brand: result.HotelBrand?.name,
              raw_chain: result.HotelChain?.name,
              raw_status: result.status,
              raw_state: result.state,
            });
          }
          setInitialLoad(false);
          setTableData(output);
        }
      });
    }
    return () => (canceled = true);
  }, [currentPage, loadData]);

  const loadMoreResults = (e) => {
    e.preventDefault();
    loadData(nextToken).then(async (results) => {
      let output = [];
      setNextToken(results.data.searchHotelProperties.nextToken);
      results.data.searchHotelProperties.items.sort((a, b) =>
        a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
      for (const result of results.data.searchHotelProperties.items.filter(
        (item) => !item['_deleted']
      )) {
        output.push({
          name: (
            <Link href={'/system/entities/hotel-properties/' + result.id}>
              <a>{result.name}</a>
            </Link>
          ),
          brand: (
            <Link href={'/system/entities/hotel-properties/' + result.id}>
              <a>{result.HotelBrand?.name}</a>
            </Link>
          ),
          chain: (
            <Link href={'/system/entities/hotel-brands/' + result.id}>
              <a>{result.HotelChain?.name}</a>
            </Link>
          ),
          status: (
            <span className={'status status-' + result.status.toLowerCase()}>{result.status}</span>
          ),
          raw_name: result.name,
          raw_brand: result.HotelBrand?.name,
          raw_chain: result.HotelChain?.name,
          raw_status: result.status,
          raw_state: result.state,
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
    // .filter((item) => chainFilter == '' || item.raw_chain == chainFilter)
    // .filter((item) => brandFilter == '' || item.raw_brand == brandFilter)
    // .filter((item) => stateFilter == '' || item.raw_state == stateFilter);
  }, [tableData]);

  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);

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

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelBrand, (b) => b.status('ne', HOTELBRANDSTATUS.DRAFT), {
        page: 0,
        limit: 999999,
      }).then((items) => {
        setBrands(items);
      });
    } else {
      API.graphql(
        graphqlOperation(listHotelBrands, {
          limit: 100000,
          filter: { status: { ne: HOTELBRANDSTATUS.DRAFT } },
        })
      ).then((results) => {
        if (results.data.listHotelBrands.items.length > 0) {
          const hotelBrands = results.data.listHotelBrands.items.sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          const archivedBrands = hotelBrands
            .filter((item) => item.status === HOTELBRANDSTATUS.ARCHIVED)
            .map((item) => deserializeModel(HotelBrand, item));
          const activeBrands = hotelBrands
            .filter((item) => item.status === HOTELBRANDSTATUS.ACTIVE)
            .map((item) => deserializeModel(HotelBrand, item));
          setBrands([...activeBrands, ...archivedBrands]);
        }
      });
    }
  }, []);

  const updateChainFilter = (e) => {
    setChainFilter(e);
    setBrandFilter(null);
  };

  const updateBrandFilter = (e) => {
    setBrandFilter(e);
  };

  const updateStateFilter = (e) => {
    setStateFilter(e);
  };

  const additionalFilterOptions = [
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
    <Selectfield
      key="brands-filter"
      useReactSelect
      useRegularSelect={false}
      options={brands
        .filter(
          (item) =>
            chainFilter?.value == '' ||
            chainFilter?.value == null ||
            chainFilter?.value == item.hotelBrandHotelChainId
        )
        .map((item) => {
          if (item.status === HOTELBRANDSTATUS.ARCHIVED) {
            return { value: item.id, label: `ARCHIVED - ${item.name}` };
          }
          return { value: item.id, label: item.name };
        })}
      placeholder="Hotel Brand..."
      blankValue=""
      inputValue={brandFilter}
      inputOnChange={updateBrandFilter}
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
          <PageTitle prefix="System / " title="Hotel Properties" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <SearchForm
                title="Search Hotel Properties"
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
