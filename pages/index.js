import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '../site.config';
import FisherhouseHeader from '@components/FisherhouseHeader';
import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { DataStore } from 'aws-amplify';
import { APPLICATIONSTATUS, USERSTATUS, READSTATUS, STAYTYPE, STAYSTATUS } from '@src/API';
import { Application, Stay } from '@src/models';
import Announcements from '@components/Announcements';
import ListHeader from '@components/ListHeader';
import LiaisonTable from '@components/LiaisonTable';
import classNames from 'classnames';
import Link from 'next/link';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listApplicationsForTable } from '@src/customQueries/loadApplicationSearchRecordsForTable';
import { getConfigurationSettingByName } from '@src/graphql/queries';
import NewGroupDialog from '@components/NewGroupDialog';
import {
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
} from '@src/graphql/subscriptions';
import humanName from '@utils/humanName';
import maskLiaisonStayStatus from '@utils/maskLiaisonStayStatus';

export default function Home() {
  const { user, profile, isAuthenticated, isAdministrator, loadingInitial, isLiaison } = useAuth();
  const router = useRouter();
  const { setMessage } = useDialog();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [shouldShowNewGroupDialog, setShouldShowNewGroupDialog] = useState(false);
  const [pageLimit, setPageLimit] = useState(0);

  const pageContainerClass = classNames('page-container', {
    admin: isAdministrator(),
    blur: shouldShowNewGroupDialog,
  });

  const handleNewGroupClick = (e) => {
    setShouldShowNewGroupDialog(true);
  };

  const closeGroupDialog = () => {
    setShouldShowNewGroupDialog(false);
  };

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

  const columns = useMemo(
    () => [
      {
        Header: 'Check-in',
        accessor: 'checkin',
        className: 'checkin-col',
        sortType: (a, b) => {
          if (
            new Date(b.values.checkin?.props?.children?.props?.children).getTime() ===
            new Date(a.values.checkin?.props?.children?.props?.children).getTime()
          ) {
            return 0;
          }
          // nulls sort after anything else
          if (
            b.values.checkin?.props?.children?.props?.children === null ||
            b.values.checkin?.props?.children?.props?.children === undefined ||
            b.values.checkin?.props?.children?.props?.children === ''
          ) {
            return -1;
          }
          if (
            a.values.checkin?.props?.children?.props?.children === null ||
            a.values.checkin?.props?.children?.props?.children === undefined ||
            a.values.checkin?.props?.children?.props?.children === ''
          ) {
            return 1;
          }
          return (
            new Date(b.values.checkin?.props?.children?.props?.children).getTime() -
            new Date(a.values.checkin?.props?.children?.props?.children).getTime()
          );
        },
      },
      {
        Header: 'Check-out',
        accessor: 'checkout',
        className: 'checkout-col',
        sortType: (a, b) => {
          if (
            new Date(b.values.checkout?.props?.children?.props?.children).getTime() ===
            new Date(a.values.checkout?.props?.children?.props?.children).getTime()
          ) {
            return 0;
          }
          // nulls sort after anything else
          if (
            b.values.checkout?.props?.children?.props?.children === null ||
            b.values.checkout?.props?.children?.props?.children === undefined ||
            b.values.checkout?.props?.children?.props?.children === ''
          ) {
            return -1;
          }
          if (
            a.values.checkout?.props?.children?.props?.children === null ||
            a.values.checkout?.props?.children?.props?.children === undefined ||
            a.values.checkout?.props?.children?.props?.children === ''
          ) {
            return 1;
          }
          return (
            new Date(b.values.checkout?.props?.children?.props?.children).getTime() -
            new Date(a.values.checkout?.props?.children?.props?.children).getTime()
          );
        },
      },
      {
        Header: 'Service Member',
        accessor: 'service_member',
        className: 'recipient-col',
        sortType: (a, b) => {
          return a.values.service_member?.props?.children?.props?.children?.localeCompare(
            b.values.service_member?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'Hotel Property',
        accessor: 'hotel',
        className: 'hotel-property-col',
        sortType: (a, b) => {
          return a.values.hotel?.props?.children?.props?.children?.localeCompare(
            b.values.hotel?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'Liaison',
        accessor: 'liaison',
        className: 'admin-col',
        sortType: (a, b) => {
          return a.values.liaison?.props?.children?.props?.children?.localeCompare(
            b.values.liaison?.props?.children?.props?.children,
            undefined,
            { sensitivity: 'base' }
          );
        },
      },
      {
        Header: 'Admin',
        accessor: 'admin',
        className: 'admin-col',
        sortType: (a, b) => {
          return a.values.admin?.props?.children?.props?.children?.localeCompare(
            b.values.admin?.props?.children?.props?.children,
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
            APPLICATIONSTATUS.DRAFT,
            APPLICATIONSTATUS.RETURNED,
            APPLICATIONSTATUS.REQUESTED,
            APPLICATIONSTATUS.EXCEPTION,
            APPLICATIONSTATUS.APPROVED,
            APPLICATIONSTATUS.DECLINED,
            APPLICATIONSTATUS.COMPLETED,
            APPLICATIONSTATUS.REVIEWED,
            APPLICATIONSTATUS.CLOSED,
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
        id: 'checkin',
        desc: false,
      },
    ],
  };

  const [inboxData, setInboxData] = useState([]);
  const [inboxDataTotal, setInboxDataTotal] = useState();
  const [openRequestData, setOpenRequestData] = useState([]);
  const [openRequestDataTotal, setOpenRequestDataTotal] = useState();

  useEffect(() => {
    API.graphql(
      graphqlOperation(getConfigurationSettingByName, {
        name: 'num_open_apps_home_screen',
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

  const loadInboxData = useCallback(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Application,
        (c) => c.liaison_read('eq', READSTATUS.UNREAD) /*.User('eq', currentProfile?.id)*/
      ).then(async (rows) => {
        let output = [];
        for (const row of rows) {
          const service_member_name =
            (row.ServiceMember && row.ServiceMember.first_name
              ? row.ServiceMember.first_name
              : '') +
            ' ' +
            (row.ServiceMember && row.ServiceMember.last_name ? row.ServiceMember.last_name : '');
          const liaison_name =
            (row.Applicant && row.Applicant.first_name ? row.Applicant.first_name : '') +
            ' ' +
            (row.Applicant && row.Applicant.last_name ? row.Applicant.last_name : '');
          const stays = await DataStore.query(Stay, (c) =>
            c.applicationID('eq', row.id).type('eq', STAYTYPE.INITIAL)
          );
          let stay = null;
          if (stays.length > 0) {
            stay = stays[0];
          }

          const status = isAdministrator()
            ? row.status ?? 'DRAFT'
            : row.status === STAYSTATUS.REVIEWED || row.status === STAYSTATUS.CLOSED
              ? STAYSTATUS.COMPLETED
              : row.status ?? 'DRAFT';
          const statusClass = classNames('status', 'status-' + status.toLowerCase());

          const checkin = (
            <Link href={'application/' + row.Application?.id}>
              <a>
                {stay?.actual_check_out
                  ? stay?.actual_check_out
                  : stay?.requested_check_out
                    ? stay?.requested_check_out
                    : ''}
              </a>
            </Link>
          );
          const checkout = (
            <Link href={'application/' + row.Application?.id}>
              <a>{stay?.requested_check_out}</a>
            </Link>
          );
          const service_member = (
            <Link href={'application/' + row.Application?.id}>
              <a>{service_member_name}</a>
            </Link>
          );
          const hotel = (
            <Link href={'application/' + row.Application?.id}>
              <a>Hotel</a>
            </Link>
          );
          const liaison = (
            <Link href={'application/' + row.Application?.id}>
              <a>{liaison_name}</a>
            </Link>
          );
          const admin = (
            <Link href={'application/' + row.Application?.id}>
              <a>Admin</a>
            </Link>
          );

          output.push({
            checkin,
            checkout,
            service_member,
            hotel,
            liaison,
            admin,
            status: <span className={statusClass}>{status}</span>,
            actions: (
              <button className="actions" title="actions">
                ...
              </button>
            ),
            raw_checkin: stay?.actual_check_out
              ? stay?.actual_check_out
              : stay?.requested_check_out
                ? stay?.requested_check_out
                : '',
          });
        }
        // output.sort((a, b) => {
        //   if (new Date(a.raw_checkin).getTime() === new Date(b.raw_checkin).getTime()) {
        //     return 0;
        //   }
        //   // nulls sort after anything else
        //   if (a.raw_checkin === null) {
        //     return -1;
        //   }
        //   if (b.raw_checkin === null) {
        //     return 1;
        //   }
        //   return new Date(a.raw_checkin).getTime() - new Date(b.raw_checkin).getTime();
        // });
        setInboxData(output);
      });
    } else {
      if (pageLimit > 0 && (isAdministrator() || profile?.AffiliationID)) {
        let filter = {};
        if (isAdministrator()) {
          filter['adminIsUnread'] = { eq: true };
        } else {
          filter['liaisonIsUnread'] = { eq: true };
          filter.liaisonAffiliationID = { eq: profile?.AffiliationID };
        }
        API.graphql(
          graphqlOperation(listApplicationsForTable, {
            filter,
            limit: pageLimit,
            sort: [
              {
                field: 'primaryCheckinDateStamp',
                direction: 'asc',
              },
            ],
          })
        )
          .then(async (results) => {
            let output = [];
            setInboxDataTotal(results.data.searchApplicationSearchRecords.total || 0);
            let filteredResults = results.data.searchApplicationSearchRecords.items;
            for (const row of filteredResults) {
              const service_member_name = humanName(row.Application?.ServiceMember);
              const liaison_name = humanName(row.Application?.User);
              const admin_name = humanName(row.Application?.AssignedTo);
              let stay = null;
              if (row.Application?.StaysInApplication.items.length > 0) {
                stay = row.Application?.StaysInApplication.items[0];
              }

              const status = isAdministrator()
                ? row.Application?.status ?? 'DRAFT'
                : row.Application?.status === STAYSTATUS.REVIEWED ||
                  row.Application?.status === STAYSTATUS.CLOSED
                  ? STAYSTATUS.COMPLETED
                  : row.Application?.status ?? 'DRAFT';
              const statusClass = classNames('status', 'status-' + status.toLowerCase());

              const checkin = (
                <Link href={'application/' + row.Application?.id}>
                  <a>
                    {stay?.actual_check_in
                      ? stay?.actual_check_in
                      : stay?.requested_check_in
                        ? stay?.requested_check_in
                        : ''}
                  </a>
                </Link>
              );
              const checkout = (
                <Link href={'application/' + row.Application?.id}>
                  <a>
                    {stay?.actual_check_out
                      ? stay?.actual_check_out
                      : stay?.requested_check_out
                        ? stay?.requested_check_out
                        : ''}
                  </a>
                </Link>
              );
              const service_member = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{service_member_name}</a>
                </Link>
              );
              const hotel = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{stay?.HotelBooked?.name || ''}</a>
                </Link>
              );
              const liaison = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{liaison_name}</a>
                </Link>
              );
              const admin = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{admin_name}</a>
                </Link>
              );

              output.push({
                checkin,
                checkout,
                service_member,
                hotel,
                liaison,
                admin,
                status: <span className={statusClass}>{status}</span>,
                raw_checkin: stay?.actual_check_out
                  ? stay?.actual_check_out
                  : stay?.requested_check_out
                    ? stay?.requested_check_out
                    : '',
              });
            }

            output.sort((a, b) => {
              if (new Date(a.raw_checkin).getTime() === new Date(b.raw_checkin).getTime()) {
                return 0;
              }
              // nulls sort after anything else
              if (a.raw_checkin === null) {
                return -1;
              }
              if (b.raw_checkin === null) {
                return 1;
              }
              return new Date(a.raw_checkin).getTime() - new Date(b.raw_checkin).getTime();
            });

            setInboxData(output);
          })
          .catch((err) => {
            console.log('Caught error1 -- ', err);
          });
      }
    }
  }, [isAdministrator, pageLimit, profile?.AffiliationID]);

  useEffect(() => {
    if (isAuthenticated() && pageLimit > 0) {
      loadInboxData();
    }
  }, [isAuthenticated, pageLimit, loadInboxData]);

  const loadOpenRequestData = useCallback(() => {
    if (shouldUseDatastore()) {
      DataStore.query(Application, (c) =>
        c.or((c) => c.status('eq')).User('eq', currentProfile?.id)
      ).then(async (rows) => {
        let output = [];
        for (const row of rows) {
          const service_member_name =
            (row.ServiceMember && row.ServiceMember.first_name
              ? row.ServiceMember.first_name
              : '') +
            ' ' +
            (row.ServiceMember && row.ServiceMember.last_name ? row.ServiceMember.last_name : '');
          const liaison_name =
            (row.Applicant && row.Applicant.first_name ? row.Applicant.first_name : '') +
            ' ' +
            (row.Applicant && row.Applicant.last_name ? row.Applicant.last_name : '');
          const stays = await DataStore.query(Stay, (c) =>
            c.applicationID('eq', row.id).type('eq', STAYTYPE.INITIAL)
          );
          let stay = null;
          if (stays.length > 0) {
            stay = stays[0];
          }

          const status = row.status ?? 'DRAFT';
          const statusClass = classNames('button', 'status-' + status.toLowerCase());

          const checkin = (
            <Link href={'application/' + row.Application?.id}>
              <a>
                {stay?.actual_check_in
                  ? stay?.actual_check_in
                  : stay?.requested_check_in
                    ? stay?.requested_check_in
                    : ''}
              </a>
            </Link>
          );
          const checkout = (
            <Link href={'application/' + row.Application?.id}>
              <a>{stay?.requested_check_out}</a>
            </Link>
          );
          const service_member = (
            <Link href={'application/' + row.Application?.id}>
              <a>{service_member_name}</a>
            </Link>
          );
          const hotel = (
            <Link href={'application/' + row.Application?.id}>
              <a>Hotel</a>
            </Link>
          );
          const liaison = (
            <Link href={'application/' + row.Application?.id}>
              <a>{liaison_name}</a>
            </Link>
          );
          const admin = (
            <Link href={'application/' + row.Application?.id}>
              <a>Admin</a>
            </Link>
          );

          output.push({
            checkin,
            checkout,
            service_member,
            hotel,
            liaison,
            admin,
            status: (
              <span className={statusClass}>
                {isAdministrator() ? status : maskLiaisonStayStatus(status)}
              </span>
            ),
            actions: (
              <button className="actions" title="actions">
                ...
              </button>
            ),
            raw_checkin: stay?.actual_check_in
              ? stay?.actual_check_in
              : stay?.requested_check_in
                ? stay?.requested_check_in
                : '',
          });
        }
        output.sort((a, b) => {
          if (new Date(a.raw_checkin).getTime() === new Date(b.raw_checkin).getTime()) {
            return 0;
          }
          // nulls sort after anything else
          if (a.raw_checkin === null) {
            return -1;
          }
          if (b.raw_checkin === null) {
            return 1;
          }
          return new Date(a.raw_checkin).getTime() - new Date(b.raw_checkin).getTime();
        });
        setOpenRequestData(output);
      });
    } else {
      if (pageLimit > 0 && (isAdministrator() || profile?.AffiliationID)) {
        let filter = {};
        if (isAdministrator()) {
          filter.or = [
            {
              applicationStatus: { eq: APPLICATIONSTATUS.REQUESTED },
            },
            {
              applicationStatus: { eq: APPLICATIONSTATUS.EXCEPTION },
            },
          ];
        } else {
          filter.or = [
            {
              applicationStatus: { eq: APPLICATIONSTATUS.DRAFT },
            },
            {
              applicationStatus: { eq: APPLICATIONSTATUS.REQUESTED },
            },
            {
              applicationStatus: { eq: APPLICATIONSTATUS.EXCEPTION },
            },
            {
              applicationStatus: { eq: APPLICATIONSTATUS.RETURNED },
            },
            {
              applicationStatus: { eq: APPLICATIONSTATUS.APPROVED },
            },
          ];
          filter.liaisonAffiliationID = { eq: profile?.AffiliationID };
        }

        API.graphql(
          graphqlOperation(listApplicationsForTable, {
            filter,
            limit: pageLimit,
            sort: [
              {
                field: 'primaryCheckinDateStamp',
                direction: 'asc',
              },
            ],
          })
        )
          .then(async (results) => {
            let output = [];
            setOpenRequestDataTotal(results.data.searchApplicationSearchRecords.total || 0);
            let filteredResults = results.data.searchApplicationSearchRecords.items;
            for (const row of filteredResults) {
              const service_member_name = humanName(row.Application?.ServiceMember);
              const liaison_name = humanName(row.Application?.User);
              const admin_name = humanName(row.Application?.AssignedTo);
              let stay = null;
              if (row.Application?.StaysInApplication.items.length > 0) {
                stay = row.Application?.StaysInApplication.items[0];
              }

              const status = row.Application?.status ?? 'DRAFT';
              const statusClass = classNames('status', 'status-' + status.toLowerCase());

              const checkin = (
                <Link href={'application/' + row.Application?.id}>
                  <a>
                    {stay?.actual_check_in
                      ? stay?.actual_check_in
                      : stay?.requested_check_in
                        ? stay?.requested_check_in
                        : ''}
                  </a>
                </Link>
              );
              const checkout = (
                <Link href={'application/' + row.Application?.id}>
                  <a>
                    {stay?.actual_check_out
                      ? stay?.actual_check_out
                      : stay?.requested_check_out
                        ? stay?.requested_check_out
                        : ''}
                  </a>
                </Link>
              );
              const service_member = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{service_member_name}</a>
                </Link>
              );
              const hotel = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{stay?.HotelBooked?.name || ''}</a>
                </Link>
              );
              const liaison = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{liaison_name}</a>
                </Link>
              );
              const admin = (
                <Link href={'application/' + row.Application?.id}>
                  <a>{admin_name}</a>
                </Link>
              );

              output.push({
                checkin,
                checkout,
                service_member,
                hotel,
                liaison,
                admin,
                status: (
                  <span className={statusClass}>
                    {isAdministrator() ? status : maskLiaisonStayStatus(status)}
                  </span>
                ),
                raw_checkin: stay?.actual_check_in
                  ? stay?.actual_check_in
                  : stay?.requested_check_in
                    ? stay?.requested_check_in
                    : '',
              });
            }
            // output.sort((a, b) => {
            //   if (new Date(a.raw_checkin).getTime() === new Date(b.raw_checkin).getTime()) {
            //     return 0;
            //   }
            //   // nulls sort after anything else
            //   if (a.raw_checkin === null) {
            //     return -1;
            //   }
            //   if (b.raw_checkin === null) {
            //     return 1;
            //   }
            //   return new Date(a.raw_checkin).getTime() - new Date(b.raw_checkin).getTime();
            // });
            setOpenRequestData(output);
          })
          .catch((err) => {
            console.log('Caught error2 -- ', err);
          });
      }
    }
  }, [currentProfile?.id, pageLimit, isAdministrator, profile?.AffiliationID]);

  useEffect(() => {
    loadOpenRequestData();
  }, [loadOpenRequestData]);

  useEffect(() => {
    if (isAuthenticated() && pageLimit > 0) {
      const create_application_subscription = API.graphql(
        graphqlOperation(onCreateApplication)
      ).subscribe({
        next: (a) => {
          console.log('On create application fired.');
          // Just re-run the query.
          setTimeout(() => {
            loadInboxData();
            loadOpenRequestData();
          }, 1000);
        },
        error: (e) => {
          console.log(
            'Error when connecting to onCreateApplication homepage subscription.',
            e.message
          );
        },
      });

      const update_application_subscription = API.graphql(
        graphqlOperation(onUpdateApplication)
      ).subscribe({
        next: (a) => {
          console.log('On update application fired.');
          // Just re-run the query.
          setTimeout(() => {
            loadInboxData();
            loadOpenRequestData();
          }, 1000);
        },
        error: (e) => {
          console.log(
            'Error when connecting to onUpdateApplication homepage subscription.',
            e.message
          );
        },
      });

      const delete_application_subscription = API.graphql(
        graphqlOperation(onDeleteApplication)
      ).subscribe({
        next: (a) => {
          console.log('On delete application fired.');
          // Just re-run the query.
          setTimeout(() => {
            loadInboxData();
            loadOpenRequestData();
          }, 1000);
        },
        error: (e) => {
          console.log(
            'Error when connecting to onDeleteApplication homepage subscription.',
            e.message
          );
        },
      });

      return () => {
        create_application_subscription.unsubscribe();
        update_application_subscription.unsubscribe();
        delete_application_subscription.unsubscribe;
      };
    }
  }, [isAuthenticated, pageLimit, loadInboxData, loadOpenRequestData]);

  const _inboxDataMemo = useMemo(() => inboxData, [inboxData]);

  const inboxTitle = (inboxDataTotal === undefined || inboxDataTotal === null)
    ? 'Loading...'
    : 'Inbox (' + inboxDataTotal + ' items)';

  const _openRequestDataMemo = useMemo(() => openRequestData, [openRequestData]);

  const openRequestTitle = (openRequestDataTotal === undefined || openRequestDataTotal === null)
    ? 'Loading...'
    : 'Open Requests (' + openRequestDataTotal + ' items)';

  const navigateToInboxApplicationsView = (e) => {
    e.preventDefault();
    router.push({ pathname: '/application', query: { unread: true, inbox: true } });
  };

  const navigateToOpenApplicationsView = (e) => {
    e.preventDefault();
    let query = {};
    if (isAdministrator()) {
      query.status = [APPLICATIONSTATUS.REQUESTED, APPLICATIONSTATUS.EXCEPTION].join('|');
    } else {
      query.status = [
        APPLICATIONSTATUS.DRAFT,
        APPLICATIONSTATUS.REQUESTED,
        APPLICATIONSTATUS.EXCEPTION,
        APPLICATIONSTATUS.RETURNED,
        APPLICATIONSTATUS.APPROVED,
      ].join('|');
    }
    router.push({ pathname: '/application', query });
  };

  if (loadingInitial || typeof isAuthenticated !== 'function' || !router.isReady) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    if (router.query && router.query.username) {
      router.push('/user?username=' + router.query.username);
    } else {
      router.push('/user');
    }
    return null;
  } else if (currentProfile == null) {
    return null;
  } else if (currentProfile?.status != USERSTATUS.ACTIVE) {
    return null;
  }

  return (
    <Fragment>
      {shouldShowNewGroupDialog && (
        <NewGroupDialog close={closeGroupDialog} profile={currentProfile} />
      )}
      <div className={pageContainerClass}>
        <FisherhouseHeader title={config.title} description={config.description} />

        <PageHeader withMenu={true} />

        <IntroBlock withImage={false} />

        <section className="main-content">
          <div className="container">
            <Announcements />

            <ListHeader
              title="Home"
              shouldHaveNewApplicationButton={true}
              shouldHaveNewGroupButton
              onNewGroupClick={handleNewGroupClick}
              profile={currentProfile}
            />

            <LiaisonTable
              title={inboxTitle}
              columns={columns}
              tableClassName="liaison-inbox"
              initialTableState={initialTableState}
              data={_inboxDataMemo}
              pagerText={'(' + _inboxDataMemo.length + ' of ' + (inboxDataTotal || 0) + ')'}
              onPagerTrigger={navigateToInboxApplicationsView}
              showLoader={inboxDataTotal === undefined ? true : false}
            />

            <LiaisonTable
              title={openRequestTitle}
              columns={columns}
              tableClassName="liaison-inbox"
              initialTableState={initialTableState}
              data={_openRequestDataMemo}
              pagerText={
                '(' + _openRequestDataMemo.length + ' of ' + (openRequestDataTotal || 0) + ')'
              }
              onPagerTrigger={navigateToOpenApplicationsView}
              showLoader={openRequestDataTotal === undefined ? true : false}
            />
          </div>
        </section>
      </div>
    </Fragment>
  );
}
