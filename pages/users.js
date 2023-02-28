import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SearchForm from '@components/SearchForm';
import useAuth from '@contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { USERSTATUS } from '@src/API';
import Checkboxfield from '@components/Inputs/Checkboxfield';
import SystemEntityTable from '@components/SystemEntityTable';
import { User as Profile } from '@src/models';
import { Predicates, DataStore } from '@aws-amplify/datastore';
import Link from 'next/link';
import humanName from '@utils/humanName';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { searchUsers } from '@src/graphql/queries';
import useDialog from '@contexts/DialogContext';
import format from 'date-fns/format';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';

export default function AdministrativeUsersPage() {
  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();
  const router = useRouter();

  const [initialLoad, setInitialLoad] = useState(true);

  const handleEditMyProfileButtonClick = (e) => {
    e.preventDefault();
    router.push('/profile');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    Object.values(USERSTATUS)
      .map((val) => {
        return val;
      })
      .filter((item) => item !== 'DRAFT' && item !== 'INACTIVE')
  );
  const [roleSelections, setRoleSelections] = useState(['administrators', 'liaisons']);
  const [nextToken, setNextToken] = useState('');

  const updateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterOptions = Object.values(USERSTATUS)
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

  const updateRoleSelections = (e) => {
    if (e.target.checked) {
      setRoleSelections([...roleSelections, e.target.value]);
    } else {
      setRoleSelections(roleSelections.filter((item) => item !== e.target.value));
    }
  };

  const additionalFilterOptions = [
    <Checkboxfield
      key="update-role-selections-administrators-checkbox"
      inputOnChange={updateRoleSelections}
      label="Administrators"
      inputValue="administrators"
      inputChecked={roleSelections.includes('administrators')}
      labelClassName={'status-admin'}
    />,
    <Checkboxfield
      key="update-role-selections-liaisons-checkbox"
      inputOnChange={updateRoleSelections}
      label="Liaisons"
      inputValue="liaisons"
      inputChecked={roleSelections.includes('liaisons')}
      labelClassName={'status-liaison'}
    />,
  ];

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        className: '',
      },
      {
        Header: 'Affiliation',
        accessor: 'affiliation',
        className: '',
        sortType: (a, b) => {
          return a.values.affiliation?.props?.children?.props?.children?.localeCompare(
            b.values.affiliation?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        className: '',
        sortType: (a, b) => {
          return a.values.email?.props?.children?.props?.children?.localeCompare(
            b.values.email?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'Exp. Date',
        accessor: 'expiration',
        className: '',
        sortType: (a, b) => {
          if (
            new Date(b.values.expiration?.props?.children?.props?.children).getTime() ===
            new Date(a.values.expiration?.props?.children?.props?.children).getTime()
          ) {
            return 0;
          }
          // nulls sort after anything else
          if (
            b.values.expiration?.props?.children?.props?.children === null ||
            b.values.expiration?.props?.children?.props?.children === undefined ||
            b.values.expiration?.props?.children?.props?.children === ''
          ) {
            return -1;
          }
          if (
            a.values.expiration?.props?.children?.props?.children === null ||
            a.values.expiration?.props?.children?.props?.children === undefined ||
            a.values.expiration?.props?.children?.props?.children === ''
          ) {
            return 1;
          }
          return (
            new Date(b.values.expiration?.props?.children?.props?.children).getTime() -
            new Date(a.values.expiration?.props?.children?.props?.children).getTime()
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        className: 'status-col',
        sortType: (a, b) => {
          let sortOrder = [USERSTATUS.PENDING, USERSTATUS.ACTIVE, USERSTATUS.INACTIVE];
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

  const incrementPage = (e) => {
    e.preventDefault();
    setCurrentPage(currentPage + 1);
  };

  const loadUsers = useCallback((token) => {
    let variables = {
      filter: {
        status: { ne: USERSTATUS.DRAFT }
      },
      limit: 100,
    };
    if (token) {
      variables['nextToken'] = token;
    }
    return API.graphql(graphqlOperation(searchUsers, variables));
  }, []);

  const loadAllUsers = useCallback(async (token) => {
    let variables = {
      filter: {
        status: { ne: USERSTATUS.DRAFT }
      },
      limit: 100,
    };
    if (token) {
      variables['nextToken'] = token;
    }

    const results = await API.graphql(graphqlOperation(searchUsers, variables));

    let finalResults = [];
    if (results.data.searchUsers.nextToken) {
      const moreResults = await loadAllUsers(results.data.searchUsers.nextToken);
      finalResults = results.data.searchUsers.items.concat(moreResults);
    } else {
      finalResults = results.data.searchUsers.items;
    }

    finalResults = finalResults.sort((a, b) =>
      humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
    );
    finalResults = finalResults.filter(
      (item, index, self) => index === self.findIndex((t) => t.username === item.username)
    );
    finalResults = finalResults.filter((item) => !item._deleted && item.id);

    return finalResults;
  }, []);

  const getUsersInGroup = useCallback(async (groupname, token) => {
    let results = await API.get('Utils', '/utils/admins', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return results;
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(Profile, (u) => u.status('ne', USERSTATUS.DRAFT), {
        page: currentPage,
        limit: 999999,
      }).then((results) => {
        results.sort((a, b) =>
          humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        );
        let output = [];
        for (const result of results) {
          output.push({
            name: (
              <Link href={'/profile/' + result.id}>
                <a>{humanName(result)}</a>
              </Link>
            ),
            affiliation: (
              <Link href={'/profile/' + result.id}>
                <a>{result.affiliation}</a>
              </Link>
            ),
            email: (
              <Link href={'/profile/' + result.id}>
                <a>{result.username + (result.pending_email ? '*' : '')}</a>
              </Link>
            ),
            expiration: (
              <Link href={'/profile/' + result.id}>
                <a>{result.expiration_date}</a>
              </Link>
            ),
            state: (
              <Link href={'/profile/' + result.id}>
                <a>{result.state}</a>
              </Link>
            ),
            status: (
              <span
                className={'status status-' + (result.status ? result.status.toLowerCase() : '')}
              >
                {result.status}
              </span>
            ),
            raw_name: humanName(result),
            raw_email: '',
            raw_city: result.city,
            raw_state: result.state,
            raw_status: result.status,
          });
        }
        setTableData(output);
      });
    } else {
      Promise.all([loadAllUsers(), getUsersInGroup()]).then((values) => {
        let results = values[0];
        const admins = values[1];
        let output = [];

        for (const result of results) {
          output.push({
            name: (
              <Link href={'/profile/' + result.id}>
                <a>{humanName(result)}</a>
              </Link>
            ),
            affiliation: (
              <Link href={'/profile/' + result.id}>
                <a>{result.Affiliation?.name}</a>
              </Link>
            ),
            email: (
              <Link href={'/profile/' + result.id}>
                <a>{result.username + (result.pending_email ? '*' : '')}</a>
              </Link>
            ),
            expiration: (
              <Link href={'/profile/' + result.id}>
                <a>
                  {result.expiration_date
                    ? format(makeTimezoneAwareDate(result.expiration_date), 'MM/dd/yyyy')
                    : null}
                </a>
              </Link>
            ),
            state: (
              <Link href={'/profile/' + result.id}>
                <a>{result.state}</a>
              </Link>
            ),
            status: (
              <span
                className={'status status-' + (result.status ? result.status.toLowerCase() : '')}
              >
                {result.status}
              </span>
            ),
            raw_name: humanName(result),
            raw_email: result.username || '',
            raw_city: result.city,
            raw_state: result.state,
            raw_status: result.status,
            raw_role: admins.includes(result.owner) ? 'administrators' : 'liaisons',
            raw_id: result.id,
          });
        }
        setInitialLoad(false);
        setTableData(output);
      });
    }
  }, [currentPage, loadAllUsers, getUsersInGroup]);

  const loadMoreResults = (e) => {
    e.preventDefault();
    loadUsers(nextToken).then((results) => {
      setNextToken(results.data.searchUsers.nextToken);
      let output = [];
      results.data.searchUsers.items.sort((a, b) =>
        humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
      );
      for (const result of results.data.searchUsers.items.filter((item) => !item._deleted)) {
        output.push({
          name: (
            <Link href={'/profile/' + result.id}>
              <a>{humanName(result)}</a>
            </Link>
          ),
          affiliation: (
            <Link href={'/profile/' + result.id}>
              <a>{result.Affiliation?.name}</a>
            </Link>
          ),
          email: (
            <Link href={'/profile/' + result.id}>
              <a>{result.username + (result.pending_email ? '*' : '')}</a>
            </Link>
          ),
          expiration: (
            <Link href={'/profile/' + result.id}>
              <a>{result.expiration}</a>
            </Link>
          ),
          state: (
            <Link href={'/profile/' + result.id}>
              <a>{result.state}</a>
            </Link>
          ),
          status: (
            <span className={'status status-' + (result.status ? result.status.toLowerCase() : '')}>
              {result.status}
            </span>
          ),
          raw_name: humanName(result),
          raw_email: result.username,
          raw_city: result.city,
          raw_state: result.state,
          raw_status: result.status,
          raw_role: admins.includes(result.owner)
            ? 'administrators'
            : result.status != USERSTATUS.PENDING
              ? 'liaisons'
              : '',
          raw_id: result.id,
        });
      }
      if (tableData.length + output.length == results.data.searchUsers.total) {
        setNextToken(null);
      }
      setTableData((prev) => prev.concat(output));
    });
  };

  const _tableDataTotalMemo = useMemo(() => {
    return tableData
      .filter(
        (item) =>
          searchTerm == '' ||
          item.raw_email.toLowerCase().trim().includes(searchTerm.toLowerCase().trim().replace(/\s\s+/g, ' ')) ||
          item.raw_name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim().replace(/\s\s+/g, ' '))
      )
      .filter((item) => filterSelections.length == 0 || filterSelections.includes(item.raw_status))
      .filter(
        (item) =>
          roleSelections.length == 0 ||
          roleSelections.length == 2 ||
          roleSelections.includes(item.raw_role)
      );
  }, [tableData, filterSelections, roleSelections, searchTerm]);

  const _tableDataMemo = useMemo(() => {
    return tableData
      .filter(
        (item) =>
          searchTerm == '' ||
          item.raw_email.toLowerCase().trim().includes(searchTerm.toLowerCase().trim().replace(/\s\s+/g, ' ')) ||
          item.raw_name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim().replace(/\s\s+/g, ' '))
      )
      .filter((item) => filterSelections.length == 0 || filterSelections.includes(item.raw_status))
      .filter(
        (item) =>
          roleSelections.length == 0 ||
          roleSelections.length == 2 ||
          roleSelections.includes(item.raw_role)
      )
      .slice(0, (currentPage + 1) * 100);
  }, [tableData, filterSelections, roleSelections, searchTerm, currentPage]);

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
          <PageTitle
            title="User Administration"
            headerClassName="list-header"
            extraButtonClassName="new"
            extraButtonTitle="Edit My Profile"
            extraButtonOnClick={handleEditMyProfileButtonClick}
          />

          <div className="content-columns">
            <div className="main-column">
              <SearchForm
                title="Search Users"
                searchTerm={searchTerm}
                onSearchChange={updateSearchTerm}
                filterOptions={filterOptions}
                filterSelection={filterSelections}
                onFilterChange={updateFilterSelections}
                additionalFilters={additionalFilterOptions}
                includeAddNewButton={false}
              />

              <SystemEntityTable
                title={initialLoad ? 'Loading...' : _tableDataTotalMemo.length + ' Results'}
                columns={tableColumns}
                initialTableState={initialTableState}
                data={_tableDataMemo}
                showPager={_tableDataMemo.length < _tableDataTotalMemo.length}
                onPagerTrigger={incrementPage}
                pagerText={'(' + _tableDataMemo.length + ' of ' + _tableDataTotalMemo.length + ')'}
                showLoader={initialLoad}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
