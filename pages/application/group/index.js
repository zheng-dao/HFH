import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import { useRouter } from 'next/router';
import FisherhouseHeader from '@components/FisherhouseHeader';
import config from '../../../site.config';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@src/components/IntroBlock';
import { useEffect, useState, useMemo, Fragment, useCallback } from 'react';
import { USERSTATUS, APPLICATIONSTATUS, GROUPSTATUS } from '@src/API';
import Announcements from '@components/Announcements';
import ListHeader from '@components/ListHeader';
import Radios from '@components/Inputs/Radios';
import SearchFormElements from '@components/SearchFormElements';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import LiaisonTable from '@components/LiaisonTable';
import NewGroupDialog from '@components/NewGroupDialog';
import { API, graphqlOperation } from 'aws-amplify';
import Link from 'next/link';
import { getGroup, searchApplications, getConfigurationSettingByName } from '@src/graphql/queries';
import { updateGroup, deleteGroup } from '@src/graphql/mutations';
import { searchGroups } from '@src/customQueries/searchGroupsWithCreators';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import humanName from '@utils/humanName';
import InfiniteScroll from 'react-infinite-scroll-component';
import useButtonWait from '@contexts/ButtonWaitContext';
import validateRequired from '@utils/validators/required';
import { applicationByGroupId } from '@src/customQueries/listApplicationsByGroupWithDependencies';

export default function Application() {
  const router = useRouter();
  const { user, profile, isAdministrator, isAuthenticated, isLiaison } = useAuth();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [modelTypeToShow, setModelTypeToShow] = useState('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldShowNewGroupDialog, setShouldShowNewGroupDialog] = useState(false);
  const [shouldShowEditGroupDialog, setShouldShowEditGroupDialog] = useState(false);
  const [filterSelections, setFilterSelections] = useState(
    Object.values(GROUPSTATUS)
      .filter((item) => item != GROUPSTATUS.DRAFT)
      .map((val) => {
        return val;
      })
  );
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState();
  const [nextToken, setNextToken] = useState('');
  const [pageLimit, setPageLimit] = useState(0);
  const [groupId, setGroupId] = useState();
  const [group, setGroup] = useState();
  const [groupLoading, setGroupLoading] = useState(0);
  const { setIsWaiting } = useButtonWait();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [groupNameValid, setGroupNameValid] = useState(false);

  const filterOptions = useMemo(() => {
    return Object.values(GROUPSTATUS)
      .filter((item) => item != GROUPSTATUS.DRAFT)
      .map((val) => {
        return {
          key: val,
          value: val,
        };
      });
  }, []);

  const { setMessage } = useDialog();

  const isSmallScreen = useMediaQuery({ maxWidth: 560 });

  useEffect(() => {
    const query = router.query;
    if (query.term) {
      setSearchTerm(query.term);
    }
  }, [router.query]);

  useEffect(() => {
    const query = router.query;
    if (query.status) {
      const filterSelectionsFromURL = query.status.split('|');
      setFilterSelections(
        filterSelectionsFromURL.filter((item) => Object.values(APPLICATIONSTATUS).includes(item))
      );
    }
  }, [router.query]);

  useEffect(() => {
    if (modelTypeToShow == 'stays') {
    } else {
    }
  }, [modelTypeToShow]);

  useEffect(() => {
    if (user != null && profile != null) {
      switch (profile.status) {
        case USERSTATUS.DRAFT:
          setMessage(
            'Your profile requires approval before you can continue. Please complete your profile and submit it for review.'
          );
          router.push('/profile');
          break;

        case USERSTATUS.PENDING:
          setMessage('Your profile is awaiting approval. Please check back later.');
          router.push('/profile');
          break;

        case USERSTATUS.INACTIVE:
          setMessage('Your profile has expired. Please contact us for further instructions.');
          router.push('/profile');
          break;

        case USERSTATUS.ACTIVE:
          setCurrentProfile(profile);
          break;
      }
    }
  }, [user, profile, router, setMessage]);

  const { loadingInitial } = useAuth();

  useEffect(() => {
    API.graphql(
      graphqlOperation(getConfigurationSettingByName, {
        name: 'num_records_paging',
      })
    ).then((results) => {
      if (
        results.data.getConfigurationSettingByName.items &&
        results.data.getConfigurationSettingByName.items.length > 0
      ) {
        setPageLimit(results.data.getConfigurationSettingByName.items[0].value);
      } else {
        setPageLimit(2);
      }
    });
  }, []);

  const openGroupEditDialog = useCallback(
    (e, id) => {
      e.preventDefault();
      setGroupId(id);
      setGroupLoading((prev) => prev + 1);
      setGroupNameValid({ valid: true, message: '' });
      setIsWaiting(false);
      setButtonDisabled(false);
      API.graphql(graphqlOperation(getGroup, { id }))
        .then((results) => {
          setGroup(results.data.getGroup);
        })
        .finally(() => {
          setGroupLoading((prev) => prev - 1);
        });
      setGroupLoading((prev) => prev + 1);
      API.graphql(
        graphqlOperation(applicationByGroupId, {
          applicationGroupId: id,
        })
      )
        .then((results) => {
          if (
            results.data.ApplicationByGroupId.items &&
            results.data.ApplicationByGroupId.items.length > 0
          ) {
            setIsDeletable(false);
          } else {
            setIsDeletable(true);
          }
        })
        .finally(() => {
          setGroupLoading((prev) => prev - 1);
        });
      setShouldShowEditGroupDialog(true);
    },
    [setIsWaiting]
  );

  const loadGroupResults = useCallback(
    (limit, token) => {
      if (!profile?.AffiliationID) {
        return new Promise((resolve, reject) => {
          resolve([]);
        });
      }
      let filters = {};
      if (filterSelections.length > 0 && filterSelections.length != filterOptions.length) {
        filters['not'] = {
          not: {
            or: filterSelections.map((item) => {
              return { status: { eq: item } };
            }),
          },
        };
      }
      // Text search handling
      if (searchTerm.length > 0) {
        filters['name'] = { match: `${searchTerm}.*` };
      }
      filters.status = { ne: GROUPSTATUS.DRAFT };

      // return;
      if (isLiaison()) {
        return new Promise((resolve, reject) => {
          API.graphql(
            graphqlOperation(searchApplications, {
              filter:
                profile && profile?.AffiliationID
                  ? {
                    applicationGroupId: {
                      exists: true,
                    },
                    AffiliationID: {
                      eq: profile?.AffiliationID,
                    },
                  }
                  : {
                    applicationGroupId: {
                      exists: true,
                    },
                  },
              limit: 9999,
            })
          ).then((results) => {
            filters.or = results.data.searchApplications.items
              .map((item) => {
                return { id: { eq: item.applicationGroupId } };
              })
              .filter(
                (item, index, self) => index === self.findIndex((t) => t.id.eq === item.id.eq)
              );

            API.graphql(
              graphqlOperation(searchGroups, {
                filter: filters,
                limit,
                nextToken: token,
                sort: {
                  field: 'id',
                  direction: 'asc',
                },
              })
            ).then((results) => {
              console.log(results.data.searchGroups);
              setTotalResults(results.data.searchGroups.total | 0);
              setNextToken(results.data.searchGroups.nextToken);
              let output = [];
              const groups = results.data.searchGroups.items.sort((a, b) =>
                a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
              );
              groups.forEach((row) => {
                const name = (
                  <Link href={'/application/group/' + row.id}>
                    <a>{row.name}</a>
                  </Link>
                );

                const created = (
                  <Link href={'/application/group/' + row.id}>
                    <a>{format(parseISO(row.createdAt), 'MM/dd/yyyy')}</a>
                  </Link>
                );
                const creator = (
                  <Link href={'/application/group/' + row.id}>
                    <a>{humanName(row.creator)}</a>
                  </Link>
                );

                const actions = (
                  <button className="edit" onClick={(e) => openGroupEditDialog(e, row.id)}>
                    Edit
                  </button>
                );

                const status = row.status ?? 'DRAFT';
                const statusClass = classNames('status', 'status-' + status.toLowerCase());

                output.push({
                  name,
                  created,
                  creator,
                  status: <span className={statusClass}>{status}</span>,
                  actions,
                  raw_name: row.name,
                });
              });
              resolve(output);
            });
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          API.graphql(
            graphqlOperation(searchGroups, {
              filter: filters,
              limit,
              nextToken: token,
              sort: {
                field: 'id',
                direction: 'asc',
              },
            })
          ).then((results) => {
            setTotalResults(results.data.searchGroups.total | 0);
            setNextToken(results.data.searchGroups.nextToken);
            let output = [];
            const groups = results.data.searchGroups.items.sort((a, b) =>
              a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
            );
            groups.forEach((row) => {
              const name = (
                <Link href={'/application/group/' + row.id}>
                  <a>{row.name}</a>
                </Link>
              );

              const created = (
                <Link href={'/application/group/' + row.id}>
                  <a>{format(parseISO(row.createdAt), 'MM/dd/yyyy')}</a>
                </Link>
              );
              const creator = (
                <Link href={'/application/group/' + row.id}>
                  <a>{humanName(row.creator)}</a>
                </Link>
              );

              const actions = (
                <button className="edit" onClick={(e) => openGroupEditDialog(e, row.id)}>
                  Edit
                </button>
              );

              const status = row.status ?? 'DRAFT';
              const statusClass = classNames('status', 'status-' + status.toLowerCase());

              output.push({
                name,
                created,
                creator,
                status: <span className={statusClass}>{status}</span>,
                actions,
                raw_name: row.name,
              });
            });
            resolve(output);
          });
        });
      }
    },
    [
      filterSelections,
      searchTerm,
      filterOptions.length,
      openGroupEditDialog,
      profile?.AffiliationID,
      isLiaison,
    ]
  );

  useEffect(() => {
    if (pageLimit > 0) {
      loadGroupResults(pageLimit).then((output) => {
        setData(output);
      });
    }
  }, [filterSelections, pageLimit, loadGroupResults]);

  const handleShowMoreClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    loadGroupResults(pageLimit, nextToken).then((output) => {
      setData((prev) =>
        [...prev, ...output].sort((a, b) =>
          a.raw_name?.localeCompare(b.raw_name, undefined, { sensitivity: 'base' })
        )
      );
    });
  };

  const _dataMemo = useMemo(() => data, [data]);

  const updateFilterSelections = (e) => {
    if (e.target.checked) {
      setFilterSelections([...filterSelections, e.target.value]);
    } else {
      setFilterSelections(filterSelections.filter((item) => item !== e.target.value));
    }
  };

  const columns = useMemo(
    () =>
      isSmallScreen
        ? [
          {
            Header: 'Group Name',
            accessor: 'name',
            className: 'groupname-col',
          },
          {
            Header: 'Status',
            accessor: 'status',
            className: 'status-col',
          },
        ]
        : [
          {
            Header: 'Group Name',
            accessor: 'name',
            className: 'groupname-col',
          },
          {
            Header: 'Date Created',
            accessor: 'created',
            className: 'date-col',
          },
          {
            Header: 'Creator',
            accessor: 'creator',
            className: 'creator-col',
          },
          {
            Header: 'Status',
            accessor: 'status',
            className: 'status-col',
          },
          {
            Header: ' ',
            className: 'actions-col',
            accessor: 'actions',
          },
        ],
    [isSmallScreen]
  );

  const pageContainerClass = classNames('page-container', {
    admin: isAdministrator(),
    blur: shouldShowNewGroupDialog || shouldShowEditGroupDialog,
  });

  const handleNewGroupClick = (e) => {
    setShouldShowNewGroupDialog(true);
  };

  const closeGroupDialog = () => {
    setShouldShowNewGroupDialog(false);
  };

  const closeGroupEditDialog = (e) => {
    e.preventDefault();
    setGroup(null);
    setGroupId('');
    setShouldShowEditGroupDialog(false);
  };

  const groupEditDialogContentClass = classNames('dialog-content', {
    loading: groupLoading,
  });

  const groupEditCancelButton = classNames('cancel', {
    disabled: buttonDisabled,
  });

  const groupEditArchiveButton = classNames('archive', {
    disabled: buttonDisabled,
  });

  const groupEditActivateButton = classNames('activate', {
    disabled: buttonDisabled,
  });

  const groupEditDeleteButton = classNames('delete', {
    disabled: buttonDisabled,
  });

  const groupEditSaveButton = classNames('ok', {
    disabled: buttonDisabled,
  });

  const groupNameInput = classNames('group-name', {
    error: !groupNameValid.valid,
  });

  const saveGroupButtonPress = (e) => {
    e.preventDefault();
    if (groupNameValid.valid) {
      setIsWaiting(true);
      setButtonDisabled(true);
      API.graphql(
        graphqlOperation(updateGroup, {
          input: {
            id: group.id,
            name: group.name,
          },
        })
      )
        .then(() => {
          setTimeout(() => {
            loadGroupResults(pageLimit).then((output) => {
              setData(output);
              closeGroupEditDialog(e);
              setIsWaiting(false);
            });
          }, 2500);
        })
        .catch(() => {
          setIsWaiting(false);
          setButtonDisabled(false);
        });
    }
  };

  const activateGroupButtonPress = (e) => {
    e.preventDefault();
    if (groupNameValid.valid) {
      setIsWaiting(true);
      setButtonDisabled(true);
      API.graphql(
        graphqlOperation(updateGroup, {
          input: {
            id: groupId,
            name: group.name,
            status: GROUPSTATUS.ACTIVE,
          },
        })
      )
        .then(() => {
          setTimeout(() => {
            loadGroupResults(pageLimit).then((output) => {
              setData(output);
              closeGroupEditDialog(e);
              setIsWaiting(false);
              setButtonDisabled(false);
            });
          }, 2500);
        })
        .catch(() => {
          setIsWaiting(false);
          setButtonDisabled(false);
        });
    }
  };

  const archiveGroupButtonPress = (e) => {
    e.preventDefault();
    if (groupNameValid.valid) {
      setIsWaiting(true);
      setButtonDisabled(true);
      API.graphql(
        graphqlOperation(updateGroup, {
          input: {
            id: groupId,
            name: group.name,
            status: GROUPSTATUS.ARCHIVED,
          },
        })
      )
        .then(() => {
          setTimeout(() => {
            loadGroupResults(pageLimit).then((output) => {
              setData(output);
              closeGroupEditDialog(e);
              setIsWaiting(false);
              setButtonDisabled(false);
            });
          }, 2500);
        })
        .catch(() => {
          setIsWaiting(false);
          setButtonDisabled(false);
        });
    }
  };

  const deleteGroupButtonPress = (e) => {
    e.preventDefault();
    if (groupNameValid.valid) {
      setIsWaiting(true);
      setButtonDisabled(true);
      API.graphql(
        graphqlOperation(deleteGroup, {
          input: {
            id: groupId,
          },
        })
      )
        .then(() => {
          setTimeout(() => {
            loadGroupResults(pageLimit).then((output) => {
              setData(output);
              closeGroupEditDialog(e);
              setIsWaiting(false);
              setButtonDisabled(false);
            });
          }, 2500);
        })
        .catch(() => {
          setIsWaiting(false);
          setButtonDisabled(false);
        });
    }
  };

  const updateOrDeleteSearchParamInUrl = (searchParams, name, value) => {
    if (value) {
      searchParams.set(name, JSON.stringify(value));
    } else {
      searchParams.delete(name);
    }
  };

  const updateModelTypeToShow = (e) => {
    setModelTypeToShow(e.target.value);
    let query = router.query;
    const params = localStorage.getItem('search-params');
    let searchParams = new URLSearchParams(params);
    searchParams.set('type', JSON.stringify(e.target.value));
    localStorage.setItem('search-params', searchParams);
    query = Object.fromEntries(new URLSearchParams(searchParams));
    if (e.target.value == 'applications') {
      // router.push({ pathname: '/application', query: query });
      router.push({ pathname: '/application' });
    } else if (e.target.value == 'stays') {
      // Per https://app.asana.com/0/1201511443262514/1202827390654145/f, always go back to Application view for saved search.
      router.push({ pathname: '/application' });
    } else {
      // Do nothing...we are already here.
    }
  };

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  }

  if (currentProfile != null) {
    return (
      <Fragment>
        {shouldShowNewGroupDialog && (
          <NewGroupDialog close={closeGroupDialog} profile={currentProfile} />
        )}
        {shouldShowEditGroupDialog && (
          <div className="dialog">
            <div className="dialog-box">
              <button className="close" onClick={closeGroupEditDialog}>
                Close
              </button>
              <div className={groupEditDialogContentClass}>
                <form>
                  <h2>Edit Group</h2>
                  <label>Group Name</label>
                  <input
                    className={groupNameInput}
                    type="text"
                    value={group?.name}
                    onChange={(e) => setGroup({ ...group, name: e.target.value })}
                    onBlur={(e) => setGroupNameValid(validateRequired(e.target.value))}
                  />
                  {!groupNameValid.valid && <p className="errMsg">{groupNameValid.message}</p>}

                  <div className="dialog-controls">
                    <button
                      className={groupEditCancelButton}
                      disabled={buttonDisabled}
                      onClick={closeGroupEditDialog}
                    >
                      Cancel
                    </button>
                    {isDeletable && (
                      <button
                        className={groupEditDeleteButton}
                        disabled={buttonDisabled}
                        onClick={deleteGroupButtonPress}
                      >
                        Delete Group
                      </button>
                    )}
                    {!isDeletable && group?.status == GROUPSTATUS.ACTIVE && (
                      <button
                        className={groupEditArchiveButton}
                        disabled={buttonDisabled}
                        onClick={archiveGroupButtonPress}
                      >
                        Archive Group
                      </button>
                    )}
                    {!isDeletable && group?.status == GROUPSTATUS.ARCHIVED && (
                      <button
                        className={groupEditActivateButton}
                        disabled={buttonDisabled}
                        onClick={activateGroupButtonPress}
                      >
                        Activate Group
                      </button>
                    )}

                    <button
                      className={groupEditSaveButton}
                      disabled={buttonDisabled}
                      onClick={saveGroupButtonPress}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className={pageContainerClass}>
          <FisherhouseHeader title={config.title} description={config.description} />

          <PageHeader />

          <IntroBlock />

          <section className="main-content">
            <div className="container">
              <Announcements />

              <ListHeader
                title="Applications"
                shouldHaveNewApplicationButton={true}
                shouldHaveNewGroupButton
                onNewGroupClick={handleNewGroupClick}
                profile={currentProfile}
              >
                <form className="main-search" id="main-search">
                  <Radios
                    title="Show: "
                    selected={modelTypeToShow}
                    onChange={updateModelTypeToShow}
                    options={[
                      { key: 'applications', value: ' Applications' },
                      { key: 'stays', value: ' Individual Stays' },
                      { key: 'groups', value: ' Groups' },
                    ]}
                  />

                  <SearchFormElements
                    filterOptions={filterOptions}
                    onFilterChange={updateFilterSelections}
                    filterSelection={filterSelections}
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </ListHeader>

              <InfiniteScroll
                dataLength={_dataMemo.length}
                next={handleShowMoreClick}
                hasMore={_dataMemo.length < totalResults}
              // loader={<h4 style={{ color: 'white' }}>Loading...</h4>}
              >
                <LiaisonTable
                  title={totalResults === undefined ? 'Loading...' : `${totalResults} Results`}
                  tableClassName="liaison-search-results"
                  columns={columns}
                  // initialTableState={}
                  data={_dataMemo}
                  pagerText={'(' + _dataMemo.length + ' of ' + (totalResults || 0) + ')'}
                  showPager={_dataMemo.length < totalResults}
                  onPagerTrigger={handleShowMoreClick}
                  showLoader={totalResults === undefined ? true : false}
                />
              </InfiniteScroll>
            </div>
          </section>
        </div>
      </Fragment>
    );
  } else {
    return null;
  }
}
