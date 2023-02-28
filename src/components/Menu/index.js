import Link from 'next/link';
import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import { useRouter } from 'next/router';
import { DataStore } from '@aws-amplify/datastore';
import { useEffect, useState } from 'react';
import { Application, User, HotelChain, HotelBrand, HotelProperty, Affiliation } from '@src/models';
import {
  READSTATUS,
  USERSTATUS,
  HOTELCHAINSTATUS,
  HOTELBRANDSTATUS,
  HOTELPROPERTYSTATUS,
  AFFILIATIONSTATUS,
  AFFILIATIONTYPE,
} from '@src/API';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  listApplications,
  searchApplications,
  listUsers,
  searchUsers,
  listHotelChains,
  searchHotelChains,
  listHotelBrands,
  searchHotelBrands,
  listHotelProperties,
  searchHotelProperties,
  listAffiliations,
  searchAffiliations,
} from '@src/graphql/queries';
import { onUpdateUser } from '@src/customQueries/subscribeUserUpdates';
import {
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
  onCreateHotelChain,
  onUpdateHotelChain,
  onDeleteHotelChain,
  onCreateHotelBrand,
  onUpdateHotelBrand,
  onDeleteHotelBrand,
  onCreateHotelProperty,
  onUpdateHotelProperty,
  onDeleteHotelProperty,
} from '@src/graphql/subscriptions';
import {
  onCreateAffiliation,
  onUpdateAffiliation,
  onDeleteAffiliation,
} from '@src/customQueries/subscribeAffiliations';
import classNames from 'classnames';

export default function Menu(props) {
  const { setMessage } = useDialog();
  const router = useRouter();

  const { isLiaison, isAdministrator, isAuthenticated, logout, user, profile } = useAuth();

  const [homeUnreadBadge, setHomeUnreadBadge] = useState(0);
  const [homeUnreadItems, setHomeUnreadItems] = useState([]);
  const [pendingUsersBadge, setPendingUsersBadge] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingSystemBadge, setPendingSystemBadge] = useState(0);
  const [pendingSystemItems, setPendingSystemItems] = useState([]);

  const attemptLogout = () => {
    logout()
      .then(() => {
        if (shouldUseDatastore()) {
          DataStore.clear();
        }
        localStorage.removeItem('search-params');
        router.push('/user');
        setMessage('You have been logged out of the system.');
      })
      .catch((err) => setMessage(err.message));
  };

  useEffect(() => {
    if (isLiaison() && profile?.AffiliationID) {
      if (shouldUseDatastore()) {
        DataStore.query(Application, (a) => a.liaison_read('eq', READSTATUS.UNREAD)).then(
          (results) => {
            setHomeUnreadBadge(results.length);
          }
        );
      } else {
        API.graphql(
          graphqlOperation(searchApplications, {
            filter: {
              liaison_read: { eq: READSTATUS.UNREAD },
              AffiliationID: { eq: profile?.AffiliationID },
            },
          })
        ).then((results) => {
          setHomeUnreadBadge(results.data.searchApplications.total);
          setHomeUnreadItems(results.data.searchApplications.items.map((item) => item.id));
        });
      }
    } else if (isAdministrator()) {
      if (shouldUseDatastore()) {
        DataStore.query(Application, (a) => a.admin_read('eq', READSTATUS.UNREAD)).then(
          (results) => {
            setHomeUnreadBadge(results.length);
          }
        );
      } else {
        API.graphql(
          graphqlOperation(searchApplications, {
            filter: { admin_read: { eq: READSTATUS.UNREAD } },
          })
        ).then((results) => {
          setHomeUnreadBadge(results.data.searchApplications.total);
          setHomeUnreadItems(results.data.searchApplications.items.map((item) => item.id));
        });
      }
    } else {
      setHomeUnreadBadge(0);
      setHomeUnreadItems([]);
    }
  }, [isLiaison, isAdministrator, profile?.AffiliationID]);

  useEffect(() => {
    if (isAdministrator()) {
      if (shouldUseDatastore()) {
        DataStore.query(User, (u) => u.status('eq', USERSTATUS.PENDING)).then((results) => {
          setPendingUsersBadge(results.length);
        });
      } else {
        API.graphql(
          graphqlOperation(searchUsers, { filter: { status: { eq: USERSTATUS.PENDING } } })
        ).then((results) => {
          setPendingUsersBadge(results.data.searchUsers.total);
          setPendingUsers(results.data.searchUsers.items.map((item) => item.id));
        });
      }
    }
  }, [isAdministrator]);

  useEffect(() => {
    if (isAdministrator()) {
      if (shouldUseDatastore()) {
        Promise.all([
          DataStore.query(HotelChain, (c) => c.status('eq', HOTELCHAINSTATUS.PENDING)),
          DataStore.query(HotelBrand, (b) => b.status('eq', HOTELBRANDSTATUS.PENDING)),
          DataStore.query(HotelProperty, (p) => p.status('eq', HOTELPROPERTYSTATUS.PENDING)),
          DataStore.query(Affiliation, (a) => a.status('eq', AFFILIATIONSTATUS.PENDING)),
        ]).then((results) => {
          setPendingSystemBadge(
            results.reduce((prev, a) => {
              return prev + a.length;
            }, 0)
          );
        });
      } else {
        Promise.all([
          API.graphql(
            graphqlOperation(searchHotelChains, {
              filter: { status: { eq: HOTELCHAINSTATUS.PENDING } },
            })
          ),
          API.graphql(
            graphqlOperation(searchHotelBrands, {
              filter: { status: { eq: HOTELBRANDSTATUS.PENDING } },
            })
          ),
          API.graphql(
            graphqlOperation(searchHotelProperties, {
              filter: { status: { eq: HOTELPROPERTYSTATUS.PENDING } },
            })
          ),
          API.graphql(
            graphqlOperation(searchAffiliations, {
              filter: { status: { eq: AFFILIATIONSTATUS.PENDING } },
            })
          ),
        ]).then((results) => {
          setPendingSystemBadge(
            results.reduce((prev, a) => {
              const key = Object.keys(a.data)[0];
              setPendingSystemItems((prev) => [
                ...new Set(prev.concat(a.data[key].items.map((item) => item.id))),
              ]);
              return a.data[key].total + prev;
            }, 0)
          );
        });
      }
    }
  }, [isAdministrator]);

  useEffect(() => {
    if (isAdministrator()) {
      const subscription = API.graphql(graphqlOperation(onUpdateUser)).subscribe({
        next: (u) => {
          const { id, status } = u.value.data.onUpdateUser;
          if (id && status) {
            const isExistingUser = pendingUsers.indexOf(id) >= 0;
            if (isExistingUser) {
              if (status != USERSTATUS.PENDING) {
                setPendingUsers((prev) => prev.filter((item) => item != id));
                setPendingUsersBadge((prev) => prev - 1);
              }
            } else {
              if (status == USERSTATUS.PENDING) {
                setPendingUsers((prev) => prev.concat(id));
                setPendingUsersBadge((prev) => prev + 1);
              }
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onUpdateUser menu subscription.', e);
        },
      });

      return () => subscription.unsubscribe();
    }
  }, [pendingUsers, isAdministrator]);

  useEffect(() => {
    if (isAdministrator() || isLiaison()) {
      const update_subscription = API.graphql(graphqlOperation(onUpdateApplication)).subscribe({
        next: (app) => {
          const { id, admin_read, liaison_read, AffiliationID } =
            app.value.data.onUpdateApplication;
          const isExistingRecord = homeUnreadItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (isAdministrator()) {
              if (admin_read != READSTATUS.UNREAD) {
                setHomeUnreadItems((prev) => prev.filter((item) => item != id));
                setHomeUnreadBadge((prev) => prev - 1);
              }
            } else if (isLiaison()) {
              if (liaison_read != READSTATUS.UNREAD && AffiliationID == profile?.AffiliationID) {
                setHomeUnreadItems((prev) => prev.filter((item) => item != id));
                setHomeUnreadBadge((prev) => prev - 1);
              }
            }
          } else {
            if (isAdministrator()) {
              if (admin_read == READSTATUS.UNREAD) {
                setHomeUnreadItems((prev) => prev.concat(id));
                setHomeUnreadBadge((prev) => prev + 1);
              }
            } else if (isLiaison()) {
              if (liaison_read == READSTATUS.UNREAD && AffiliationID == profile?.AffiliationID) {
                setHomeUnreadItems((prev) => prev.concat(id));
                setHomeUnreadBadge((prev) => prev + 1);
              }
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onUpdateApplication menu subscription.', e);
        },
      });

      const create_subscription = API.graphql(graphqlOperation(onCreateApplication)).subscribe({
        next: (app) => {
          const { id, admin_read, liaison_read, AffiliationID } =
            app.value.data.onCreateApplication;
          if (isAdministrator()) {
            if (admin_read == READSTATUS.UNREAD) {
              setHomeUnreadItems((prev) => prev.concat(id));
              setHomeUnreadBadge((prev) => prev + 1);
            }
          } else if (isLiaison()) {
            if (liaison_read == READSTATUS.UNREAD && AffiliationID == profile?.AffiliationID) {
              setHomeUnreadItems((prev) => prev.concat(id));
              setHomeUnreadBadge((prev) => prev + 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onCreateApplication menu subscription.', e);
        },
      });

      const delete_subscription = API.graphql(graphqlOperation(onDeleteApplication)).subscribe({
        next: (app) => {
          const { id, admin_read, liaison_read, AffiliationID } =
            app.value.data.onDeleteApplication;
          const isExistingRecord = homeUnreadItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (isAdministrator()) {
              if (admin_read == READSTATUS.UNREAD) {
                setHomeUnreadItems((prev) => prev.filter((item) => item != id));
                setHomeUnreadBadge((prev) => prev - 1);
              }
            } else if (isLiaison()) {
              if (liaison_read == READSTATUS.UNREAD && AffiliationID == profile?.AffiliationID) {
                setHomeUnreadItems((prev) => prev.filter((item) => item != id));
                setHomeUnreadBadge((prev) => prev - 1);
              }
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onDeleteApplication menu subscription.', e);
        },
      });

      return () => {
        update_subscription.unsubscribe();
        create_subscription.unsubscribe();
        delete_subscription.unsubscribe();
      };
    }
  }, [homeUnreadItems, isAdministrator, isLiaison, profile?.AffiliationID]);

  useEffect(() => {
    if (isAdministrator) {
      const create_hotelchain_subscription = API.graphql(
        graphqlOperation(onCreateHotelChain)
      ).subscribe({
        next: (c) => {
          const { id, status } = c.value.data.onCreateHotelChain;
          if (status == HOTELCHAINSTATUS.PENDING) {
            setPendingSystemItems((prev) => prev.concat(id));
            setPendingSystemBadge((prev) => prev + 1);
          }
        },
        error: (e) => {
          console.log('Error when connecting to onCreateHotelChain menu subscription.', e);
        },
      });

      const update_hotelchain_subscription = API.graphql(
        graphqlOperation(onUpdateHotelChain)
      ).subscribe({
        next: (c) => {
          const { id, status } = c.value.data.onUpdateHotelChain;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status != HOTELCHAINSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          } else {
            if (status == HOTELCHAINSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.concat(id));
              setPendingSystemBadge((prev) => prev + 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onUpdateHotelChain menu subscription.', e);
        },
      });

      const delete_hotelchain_subscription = API.graphql(
        graphqlOperation(onDeleteHotelChain)
      ).subscribe({
        next: (c) => {
          const { id, status } = c.value.data.onDeleteHotelChain;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status == HOTELCHAINSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onDeleteHotelChain menu subscription.', e);
        },
      });

      const create_hotelbrand_subscription = API.graphql(
        graphqlOperation(onCreateHotelBrand)
      ).subscribe({
        next: (b) => {
          const { id, status } = b.value.data.onCreateHotelBrand;
          if (status == HOTELBRANDSTATUS.PENDING) {
            setPendingSystemItems((prev) => prev.concat(id));
            setPendingSystemBadge((prev) => prev + 1);
          }
        },
        error: (e) => {
          console.log('Error when connecting to onCreateHotelBrand menu subscription.', e);
        },
      });

      const update_hotelbrand_subscription = API.graphql(
        graphqlOperation(onUpdateHotelBrand)
      ).subscribe({
        next: (b) => {
          const { id, status } = b.value.data.onUpdateHotelBrand;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status != HOTELBRANDSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          } else {
            if (status == HOTELBRANDSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.concat(id));
              setPendingSystemBadge((prev) => prev + 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onUpdateHotelBrand menu subscription.', e);
        },
      });

      const delete_hotelbrand_subscription = API.graphql(
        graphqlOperation(onDeleteHotelBrand)
      ).subscribe({
        next: (b) => {
          const { id, status } = b.value.data.onDeleteHotelBrand;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status == HOTELBRANDSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onDeleteHotelBrand menu subscription.', e);
        },
      });

      const create_hotelproperty_subscription = API.graphql(
        graphqlOperation(onCreateHotelProperty)
      ).subscribe({
        next: (p) => {
          const { id, status } = p.value.data.onCreateHotelProperty;
          if (status == HOTELPROPERTYSTATUS.PENDING) {
            setPendingSystemItems((prev) => prev.concat(id));
            setPendingSystemBadge((prev) => prev + 1);
          }
        },
        error: (e) => {
          console.log('Error when connecting to onCreateHotelProperty menu subscription.', e);
        },
      });

      const update_hotelproperty_subscription = API.graphql(
        graphqlOperation(onUpdateHotelProperty)
      ).subscribe({
        next: (p) => {
          const { id, status } = p.value.data.onUpdateHotelProperty;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status != HOTELPROPERTYSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          } else {
            if (status == HOTELPROPERTYSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.concat(id));
              setPendingSystemBadge((prev) => prev + 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onUpdateHotelProperty menu subscription.', e);
        },
      });

      const delete_hotelproperty_subscription = API.graphql(
        graphqlOperation(onDeleteHotelProperty)
      ).subscribe({
        next: (p) => {
          const { id, status } = p.value.data.onDeleteHotelProperty;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status == HOTELPROPERTYSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onDeleteHotelProperty menu subscription.', e);
        },
      });

      const create_affiliation_subscription = API.graphql(
        graphqlOperation(onCreateAffiliation)
      ).subscribe({
        next: (a) => {
          const { id, status } = a.value.data.onCreateAffiliation;
          if (status == AFFILIATIONSTATUS.PENDING) {
            setPendingSystemItems((prev) => prev.concat(id));
            setPendingSystemBadge((prev) => prev + 1);
          }
        },
        error: (e) => {
          console.log('Error when connecting to onCreateAffiliation menu subscription.', e);
        },
      });

      const update_affiliation_subscription = API.graphql(
        graphqlOperation(onUpdateAffiliation)
      ).subscribe({
        next: (a) => {
          const { id, status } = a.value.data.onUpdateAffiliation;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status != AFFILIATIONSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          } else {
            if (status == AFFILIATIONSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.concat(id));
              setPendingSystemBadge((prev) => prev + 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onUpdateAffiliation menu subscription.', e);
        },
      });

      const delete_affiliation_subscription = API.graphql(
        graphqlOperation(onDeleteAffiliation)
      ).subscribe({
        next: (a) => {
          const { id, status } = a.value.data.onDeleteAffiliation;
          const isExistingRecord = pendingSystemItems.indexOf(id) >= 0;
          if (isExistingRecord) {
            if (status == AFFILIATIONSTATUS.PENDING) {
              setPendingSystemItems((prev) => prev.filter((item) => item != id));
              setPendingSystemBadge((prev) => prev - 1);
            }
          }
        },
        error: (e) => {
          console.log('Error when connecting to onDeleteAffiliation menu subscription.', e);
        },
      });

      return () => {
        create_hotelchain_subscription.unsubscribe();
        update_hotelchain_subscription.unsubscribe();
        delete_hotelchain_subscription.unsubscribe();
        create_hotelbrand_subscription.unsubscribe();
        update_hotelbrand_subscription.unsubscribe();
        delete_hotelbrand_subscription.unsubscribe();
        create_hotelproperty_subscription.unsubscribe();
        update_hotelproperty_subscription.unsubscribe();
        delete_hotelproperty_subscription.unsubscribe();
        create_affiliation_subscription.unsubscribe();
        update_affiliation_subscription.unsubscribe();
        delete_affiliation_subscription.unsubscribe();
      };
    }
  }, [isAdministrator, pendingSystemItems]);

  const siteMenuClass = classNames('site-menu', {
    open: props.isMenuOpen,
  });

  useEffect(() => {
    if (user == null) {
      router.push('/user');
    }
  }, [user, router]);

  var systemMenuClass = '';
  switch (router.pathname) {
    case '/system':
      systemMenuClass = 'current';
      break;
    case '/system/entities/hotel-chains':
      systemMenuClass = 'current';
      break;
    case '/system/entities/hotel-brands':
      systemMenuClass = 'current';
      break;
    case '/system/entities/hotel-properties':
      systemMenuClass = 'current';
      break;
    case '/system/entities/medical-centers':
      systemMenuClass = 'current';
      break;
    case '/system/entities/military-bases':
      systemMenuClass = 'current';
      break;
    case '/system/entities/fisher-houses':
      systemMenuClass = 'current';
      break;
    case '/system/entities/organizations':
      systemMenuClass = 'current';
      break;
    case '/system/entities/payment-types':
      systemMenuClass = 'current';
      break;
    case '/system/entities/credit-cards':
      systemMenuClass = 'current';
      break;
    case '/system/entities/groups':
      systemMenuClass = 'current';
      break;
    case '/system/instructions':
      systemMenuClass = 'current';
      break;
    case '/system/settings':
      systemMenuClass = 'current';
      break;
    default:
      systemMenuClass = '';
      break;
  }

  return (
    <nav className="main-nav" role="navigation">
      <ul className={siteMenuClass}>
        {(isLiaison() || isAdministrator()) && profile?.status == USERSTATUS.ACTIVE && (
          <li>
            <Link href="/">
              <a className={router.pathname == '/' ? 'current' : ''}>
                Home
                {homeUnreadBadge > 0 && <span className="pending badge">{homeUnreadBadge}</span>}
              </a>
            </Link>
          </li>
        )}
        {(isLiaison() || isAdministrator()) && profile?.status == USERSTATUS.ACTIVE && (
          <li>
            <Link href="/application">
              <a className={(router.pathname == '/application' || router.pathname == '/application/group') ? 'current' : ''}>
                App<span className="abbrv">lication</span>s
              </a>
            </Link>
          </li>
        )}
        {isAdministrator() && profile?.status == USERSTATUS.ACTIVE && (
          <li>
            <Link href="/users">
              <a className={router.pathname == '/users' ? 'current' : ''}>
                Users
                {pendingUsersBadge > 0 && (
                  <span className="pending badge">{pendingUsersBadge}</span>
                )}
              </a>
            </Link>
          </li>
        )}
        {isAdministrator() && profile?.status == USERSTATUS.ACTIVE && (
          <li>
            <Link href="/reconciliation">
              <a className={router.pathname == '/reconciliation' ? 'current' : ''}>Reconcile</a>
            </Link>
          </li>
        )}
        {isAdministrator() && profile?.status == USERSTATUS.ACTIVE && (
          <li>
            <Link href="/system">
              <a className={systemMenuClass}>
                System
                {pendingSystemBadge > 0 && (
                  <span className="pending badge">{pendingSystemBadge}</span>
                )}
              </a>
            </Link>
          </li>
        )}
        {(!isAdministrator() || (isAdministrator() && profile?.status == USERSTATUS.INACTIVE)) && (
          <li>
            <Link href="/profile">
              <a className={router.pathname == '/profile' ? 'current' : ''}>My Profile</a>
            </Link>
          </li>
        )}
        <li>
          <a onClick={attemptLogout}>Log Out</a>
        </li>
      </ul>
    </nav>
  );
}

Menu.defaultProps = {
  isMenuOpen: false,
};
