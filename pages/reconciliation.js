import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import { useRouter } from 'next/router';
import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import ListHeader from '@components/ListHeader';
import SearchFormElements from '@components/SearchFormElements';
import SystemEntityTable from '@components/SystemEntityTable';
import Link from 'next/link';
import Radios from '@components/Inputs/Radios';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import { Stay, HotelChain, Card } from '@src/models';
import { STAYSTATUS, HOTELCHAINSTATUS, CARDSTATUS, PAYMENTTYPETYPE } from '@src/API';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listHotelChains, listCards } from '@src/graphql/queries';
import { updateStay } from '@src/graphql/mutations';
import { searchStays } from '@src/customQueries/searchStaysWithDependencies';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import Selectfield from '@components/Inputs/Selectfield';
import Checkboxfield from '@components/Inputs/Checkboxfield';
import { titleCase } from 'title-case';
import Datefield from '@components/Inputs/Datefield';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function Reconciliation() {
  const { loadingInitial, isAuthenticated, isAdministrator } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSelections, setFilterSelections] = useState([]);
  const [typeSelection, setTypeSelection] = useState('charges');
  const [cards, setCards] = useState([]);
  const [chains, setChains] = useState([]);
  const [cardFilter, setCardFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('');
  const [tableData, setTableData] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [checkinDateStart, setCheckinDateStart] = useState();
  const [checkinDateEnd, setCheckinDateEnd] = useState();
  const { setIsWaiting } = useButtonWait();

  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const updateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const updateTypeSelection = (e) => {
    setTypeSelection(e.target.value);
    setShowMoreClicked(false);
  };

  const updateFilterSelections = (e) => {
    if (e.target.checked) {
      setFilterSelections([...filterSelections, e.target.value]);
    } else {
      setFilterSelections(filterSelections.filter((item) => item !== e.target.value));
    }
  };

  const updateReconcileStatus = useCallback(
    (id, e) => {
      setShowMoreClicked(false);
      setIsWaiting(true);
      if (typeSelection == 'charges') {
        API.graphql(
          graphqlOperation(updateStay, {
            input: {
              id,
              charge_reconcile: e.target.checked,
            },
          })
        )
          .then((re) => {
            setIsWaiting(false);
          })
          .catch((err) => {
            console.log('Error saving record', err);
            setIsWaiting(false);
          });
      } else {
        API.graphql(
          graphqlOperation(updateStay, {
            input: {
              id,
              points_reconcile: e.target.checked,
            },
          })
        )
          .then((re) => {
            setIsWaiting(false);
          })
          .catch((err) => {
            console.log('Error saving record', err);
            setIsWaiting(false);
          });
      }
    },
    [setIsWaiting, typeSelection]
  );

  useEffect(() => {
    API.graphql(
      graphqlOperation(listHotelChains, { filter: { status: { ne: HOTELCHAINSTATUS.DRAFT } } })
    ).then((results) => {
      if (results.data.listHotelChains.items.length > 0) {
        results.data.listHotelChains.items.sort((a, b) =>
          a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        setChains(
          results.data.listHotelChains.items.map((item) => deserializeModel(HotelChain, item))
        );
      }
    });
  }, []);

  useEffect(() => {
    API.graphql(graphqlOperation(listCards, { filter: { status: { ne: CARDSTATUS.DRAFT } } })).then(
      (results) => {
        if (results.data.listCards.items.length > 0) {
          results.data.listCards.items.sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          setCards(results.data.listCards.items.map((item) => deserializeModel(Card, item)));
        }
      }
    );
  }, []);

  const initialTableState = {
    sortBy: [
      {
        id: 'check_out',
        desc: true,
      },
    ],
  };

  const tableColumns = useMemo(() => {
    if (typeSelection === 'charges') {
      return [
        {
          Header: 'Charge',
          accessor: 'cost',
          className: '',
          sortType: (a, b) => {
            return Number(b.original?.raw_cost) - Number(a.original?.raw_cost)
          }
        },
        {
          Header: 'Check-Out',
          accessor: 'check_out',
          className: '',
          sortType: (a, b) => {
            if (
              new Date(b.values.check_out?.props?.children?.props?.children).getTime() ===
              new Date(a.values.check_out?.props?.children?.props?.children).getTime()
            ) {
              return 0;
            }
            // nulls sort after anything else
            if (
              b.values.check_out?.props?.children?.props?.children === null ||
              b.values.check_out?.props?.children?.props?.children === undefined ||
              b.values.check_out?.props?.children?.props?.children === ''
            ) {
              return -1;
            }
            if (
              a.values.check_out?.props?.children?.props?.children === null ||
              a.values.check_out?.props?.children?.props?.children === undefined ||
              a.values.check_out?.props?.children?.props?.children === ''
            ) {
              return 1;
            }
            return (
              new Date(b.values.check_out?.props?.children?.props?.children).getTime() -
              new Date(a.values.check_out?.props?.children?.props?.children).getTime()
            );
          },
        },
        {
          Header: 'Hotel Property',
          accessor: 'hotel_property',
          className: '',
          sortType: (a, b) => {
            return a.values.hotel_property?.props?.children?.props?.children?.localeCompare(
              b.values.hotel_property?.props?.children?.props?.children,
              undefined,
              { sensitivity: 'base' }
            );
          },
        },
        {
          Header: 'Reservation Number',
          accessor: 'confirmation_number',
          className: '',
        },
        {
          Header: 'Reconciled',
          accessor: 'reconciled',
          className: '',
          sortType: (a, b) => {
            let sortOrder = [
              true,
              false,
              undefined,
              null
            ];
            return (
              sortOrder.indexOf(a.values.reconciled?.props?.children?.props?.inputChecked) -
              sortOrder.indexOf(b.values.reconciled?.props?.children?.props?.inputChecked)
            )
          },
        },
      ];
    } else {
      return [
        {
          Header: 'Points',
          accessor: 'cost',
          className: '',
          sortType: (a, b) => {
            return Number(b.original?.raw_cost) - Number(a.original?.raw_cost)
          }
        },
        {
          Header: 'Check-Out',
          accessor: 'check_out',
          className: '',
          sortType: (a, b) => {
            if (
              new Date(b.values.check_out?.props?.children?.props?.children).getTime() ===
              new Date(a.values.check_out?.props?.children?.props?.children).getTime()
            ) {
              return 0;
            }
            // nulls sort after anything else
            if (
              b.values.check_out?.props?.children?.props?.children === null ||
              b.values.check_out?.props?.children?.props?.children === undefined ||
              b.values.check_out?.props?.children?.props?.children === ''
            ) {
              return -1;
            }
            if (
              a.values.check_out?.props?.children?.props?.children === null ||
              a.values.check_out?.props?.children?.props?.children === undefined ||
              a.values.check_out?.props?.children?.props?.children === ''
            ) {
              return 1;
            }
            return (
              new Date(b.values.check_out?.props?.children?.props?.children).getTime() -
              new Date(a.values.check_out?.props?.children?.props?.children).getTime()
            );
          },
        },
        {
          Header: 'Hotel Property',
          accessor: 'hotel_property',
          className: '',
          sortType: (a, b) => {
            return a.values.hotel_property?.props?.children?.props?.children?.localeCompare(
              b.values.hotel_property?.props?.children?.props?.children,
              undefined,
              { sensitivity: 'base' }
            );
          },
        },
        {
          Header: 'Reservation Number',
          accessor: 'confirmation_number',
          className: '',
        },
        {
          Header: 'Reconciled',
          accessor: 'reconciled',
          className: '',
          sortType: (a, b) => {
            let sortOrder = [
              true,
              false,
              undefined,
              null
            ];
            return (
              sortOrder.indexOf(a.values.reconciled?.props?.children?.props?.inputChecked) -
              sortOrder.indexOf(b.values.reconciled?.props?.children?.props?.inputChecked)
            )
          },
        },
      ];
    }
  }, [typeSelection]);

  const loadData = useCallback(
    (token) => {
      let filter = {};
      if (typeSelection == 'charges') {
        filter = {
          // status: {
          //   eq: STAYSTATUS.COMPLETED,
          // },
          applicationID: {
            exists: true,
          },
        };
        if (searchTerm.length > 0) {
          filter.confirmation_number = {
            wildcard: searchTerm + '*',
          };
        }
        if (cardFilter) {
          filter.card = {
            eq: cardFilter.label,
          };
        }
        filter.not = {
          or: [
            { status: { eq: STAYSTATUS.DRAFT } },
            { status: { eq: STAYSTATUS.RETURNED } },
            { status: { eq: STAYSTATUS.REQUESTED } },
            { status: { eq: STAYSTATUS.EXCEPTION } },
            { status: { eq: STAYSTATUS.APPROVED } },
            {
              and: [
                { payment_type: { eq: 'Points' } },
                { card_used_for_incidentals: { ne: true } },
              ],
            },
            {
              and: [
                { payment_type: { ne: 'Credit Card' } },
                { payment_type: { ne: 'Points' } },
                { card_used_for_incidentals: { ne: true } },
              ],
            },
            {
              not: {
                and: [
                  { card: { exists: true } },
                  { card: { ne: '' } },
                  { payment_cost_of_reservation: { exists: true } },
                  { payment_cost_of_reservation: { ne: '' } },
                ],
              },
            },
          ],
        };
        if (filterSelections && filterSelections.length > 0) {
          filter.or = [];
          if (filterSelections.includes('unreconciled')) {
            filter.or.push({
              charge_reconcile: {
                ne: true,
              },
            });
          }
          if (filterSelections.includes('reconciled')) {
            filter.or.push({
              charge_reconcile: {
                eq: true,
              },
            });
          }
        }
      } else if (typeSelection == 'points') {
        filter = {
          // status: {
          //   eq: STAYSTATUS.COMPLETED,
          // },
          applicationID: {
            exists: true,
          },
          payment_type: {
            eq: 'Points',
          },
          and: [
            {
              payment_points_used: {
                exists: true,
              },
            },
            {
              payment_points_used: {
                ne: '',
              },
            },
            {
              comparable_cost: {
                exists: true,
              },
            },
            {
              comparable_cost: {
                ne: '',
              },
            },
          ],
        };
        if (searchTerm.length > 0) {
          filter.confirmation_number = {
            wildcard: searchTerm + '*',
          };
        }
        if (chainFilter) {
          filter.HotelPropertyID = {
            eq: chainFilter.value,
          };
        }
        filter.not = {
          or: [
            { status: { eq: STAYSTATUS.DRAFT } },
            { status: { eq: STAYSTATUS.RETURNED } },
            { status: { eq: STAYSTATUS.REQUESTED } },
            { status: { eq: STAYSTATUS.EXCEPTION } },
            { status: { eq: STAYSTATUS.APPROVED } },
          ],
        };
        if (filterSelections && filterSelections.length > 0) {
          filter.or = [];
          if (filterSelections.includes('unreconciled')) {
            filter.or.push({
              points_reconcile: {
                ne: true,
              },
            });
          }
          if (filterSelections.includes('reconciled')) {
            filter.or.push({
              points_reconcile: {
                eq: true,
              },
            });
          }
        }
      }

      if (checkinDateStart && checkinDateEnd) {
        filter.actual_check_out = {
          range: [checkinDateStart, checkinDateEnd],
        };
      } else if (checkinDateStart) {
        filter.actual_check_out = {
          gte: checkinDateStart,
        };
      } else if (checkinDateEnd) {
        filter.actual_check_out = {
          lte: checkinDateEnd,
        };
      }

      let variables = {
        filter,
      };
      if (token) {
        variables['nextToken'] = token;
      }
      return API.graphql(graphqlOperation(searchStays, variables));
    },
    [
      cardFilter,
      chainFilter,
      checkinDateEnd,
      checkinDateStart,
      filterSelections,
      searchTerm,
      typeSelection,
    ]
  );

  const loadMoreResults = useCallback(() => {
    setShowMoreClicked(true);
    if (nextToken) {
      loadData(nextToken).then((results) => {
        let output = [];
        setNextToken(results.data.searchStays.nextToken);
        for (const result of results.data.searchStays.items) {
          output.push({
            cost: (
              <Link href={'/application/' + result.applicationID}>
                <a>
                  {typeSelection === 'charges'
                    ? `$${result.payment_cost_of_reservation || '0'}`
                    : result.payment_points_used || '0'}
                </a>
              </Link>
            ),
            check_out: (
              <Link href={'/application/' + result.applicationID}>
                <a>
                  {result.actual_check_out
                    ? result.actual_check_out
                    : result.requested_check_out
                    ? result.requested_check_out
                    : null}
                </a>
              </Link>
            ),
            hotel_property: (
              <Link href={'/application/' + result.applicationID}>
                <a>{result.HotelBooked?.name}</a>
              </Link>
            ),
            confirmation_number: (
              <Link href={'/application/' + result.applicationID}>
                <a>{result.confirmation_number}</a>
              </Link>
            ),
            reconciled: (
              <span className="checkboxes">
                <Checkboxfield
                  inputOnChange={(e) => updateReconcileStatus(result.id, e)}
                  label={''}
                  inputValue={result.id}
                  inputChecked={
                    typeSelection === 'charges' ? result.charge_reconcile : result.points_reconcile
                  }
                  inputDisabled={
                    result.status === STAYSTATUS.REVIEWED || result.status === STAYSTATUS.CLOSED
                  }
                />
              </span>
            ),
            raw_cost: typeSelection === 'charges'
              ? (result.payment_cost_of_reservation || 0)
              : (result.payment_points_used || 0),
            raw_reconciled: result.reconciled,
            raw_card: result.card,
            raw_hotel: result.HotelBooked?.name || '',
            raw_id: result.id,
            raw_checkout: result.actual_check_out
              ? result.actual_check_out
              : result.requested_check_out
              ? result.requested_check_out
              : null,
          });
        }
        setTableData((prev) =>
          prev
            .concat(output)
            .sort((a, b) => {
              if (new Date(a.raw_checkout).getTime() === new Date(b.raw_checkout).getTime()) {
                return 0;
              }
              // nulls sort after anything else
              if (a.raw_checkout === null) {
                return -1;
              }
              if (b.raw_checkout === null) {
                return 1;
              }
              return new Date(a.raw_checkout).getTime() - new Date(b.raw_checkout).getTime();
            })
            .filter(
              (item, index, self) => index === self.findIndex((t) => t.raw_id === item.raw_id)
            )
        );
      });
    } else {
    }
  }, [loadData, nextToken, typeSelection, updateReconcileStatus]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Stay,
        (s) => s.status('eq', STAYSTATUS.COMPLETED).ready_for_final_reconcile('eq', true),
        {
          limit: 999999,
        }
      ).then((results) => {
        let output = [];
        for (const result of results) {
          output.push({
            cost: (
              <Link href={'/application/' + result.applicationID}>
                <a>${result.payment_cost_of_reservation}</a>
              </Link>
            ),
            check_out: (
              <Link href={'/application/' + result.applicationID}>
                <a>{result.actual_check_out}</a>
              </Link>
            ),
            hotel_property: (
              <Link href={'/application/' + result.applicationID}>
                <a>{'Hotel Property'}</a>
              </Link>
            ),
            confirmation_number: (
              <Link href={'/application/' + result.applicationID}>
                <a>{result.confirmation_number}</a>
              </Link>
            ),
            reconciled: (
              <Link href={'/application/' + result.applicationID}>
                <a>{result.reconciled}</a>
              </Link>
            ),
            raw_reconciled: result.reconciled,
            raw_card: result.card,
            raw_checkout: result.actual_check_out
              ? result.actual_check_out
              : result.requested_check_out
              ? result.requested_check_out
              : null,
          });
        }
        output.sort((a, b) => {
          if (new Date(a.raw_checkout).getTime() === new Date(b.raw_checkout).getTime()) {
            return 0;
          }
          // nulls sort after anything else
          if (a.raw_checkout === null) {
            return -1;
          }
          if (b.raw_checkout === null) {
            return 1;
          }
          return new Date(a.raw_checkout).getTime() - new Date(b.raw_checkout).getTime();
        });
        setTableData(output);
      });
    } else {
      if (!showMoreClicked) {
        loadData('').then((results) => {
          let output = [];
          setNextToken(results.data.searchStays.nextToken);
          setTotalCount(results.data.searchStays.total | 0);
          for (const result of results.data.searchStays.items) {
            output.push({
              cost: (
                <Link href={'/application/' + result.applicationID}>
                  <a>
                    {typeSelection === 'charges'
                      ? `$${result.payment_cost_of_reservation || '0'}`
                      : result.payment_points_used || '0'}
                  </a>
                </Link>
              ),
              check_out: (
                <Link href={'/application/' + result.applicationID}>
                  <a>
                    {result.actual_check_out
                      ? result.actual_check_out
                      : result.requested_check_out
                      ? result.requested_check_out
                      : null}
                  </a>
                </Link>
              ),
              hotel_property: (
                <Link href={'/application/' + result.applicationID}>
                  <a>{result.HotelBooked?.name}</a>
                </Link>
              ),
              confirmation_number: (
                <Link href={'/application/' + result.applicationID}>
                  <a>{result.confirmation_number}</a>
                </Link>
              ),
              reconciled: (
                <span className="checkboxes">
                  <Checkboxfield
                    inputOnChange={(e) => updateReconcileStatus(result.id, e)}
                    label={''}
                    inputValue={result.id}
                    inputChecked={
                      typeSelection === 'charges'
                        ? result.charge_reconcile
                        : result.points_reconcile
                    }
                    inputDisabled={
                      result.status === STAYSTATUS.REVIEWED || result.status === STAYSTATUS.CLOSED
                    }
                  />
                </span>
              ),
              raw_cost: typeSelection === 'charges'
                ? (result.payment_cost_of_reservation || 0)
                : (result.payment_points_used || 0),
              raw_reconciled: result.reconciled,
              raw_card: result.card,
              raw_hotel: result.HotelBooked?.name || '',
              raw_id: result.id,
              raw_checkout: result.actual_check_out
                ? result.actual_check_out
                : result.requested_check_out
                ? result.requested_check_out
                : null,
            });
          }
          output.sort((a, b) => {
            if (new Date(a.raw_checkout).getTime() === new Date(b.raw_checkout).getTime()) {
              return 0;
            }
            // nulls sort after anything else
            if (a.raw_checkout === null) {
              return -1;
            }
            if (b.raw_checkout === null) {
              return 1;
            }
            return new Date(a.raw_checkout).getTime() - new Date(b.raw_checkout).getTime();
          });
          setInitialLoad(false);
          setTableData(output);
        });
      } else {
        loadMoreResults();
      }
    }
  }, [
    typeSelection,
    searchTerm,
    filterSelections,
    cardFilter,
    chainFilter,
    checkinDateStart,
    checkinDateEnd,
    showMoreClicked,
    updateReconcileStatus,
    loadData,
    loadMoreResults,
  ]);

  const updateCardFilter = (e) => {
    setCardFilter(e);
  };

  const updateChainFilter = (e) => {
    setChainFilter(e);
  };

  const additionalFilters =
    typeSelection == 'charges'
      ? [
          <Selectfield
            key="charges-filter"
            useReactSelect
            useRegularSelect={false}
            options={cards.map((item) => {
              return { value: item.id, label: item.name };
            })}
            placeholder="Card..."
            blankValue=""
            inputValue={cardFilter}
            inputOnChange={updateCardFilter}
          />,
        ]
      : [
          <Selectfield
            key="points-filter"
            useReactSelect
            useRegularSelect={false}
            options={chains.map((item) => {
              return { value: item.id, label: item.name };
            })}
            placeholder="Hotel Chain..."
            blankValue=""
            inputValue={chainFilter}
            inputOnChange={updateChainFilter}
          />,
        ];

  const _tableDataMemo = useMemo(() => {
    // @TODO -- implement filtering.
    return tableData;
    // .filter((item) => filterSelections.length == 0 || filterSelections.includes(item.raw_status))
    // .filter((item) => {
    //   return searchTerm == '' || item.raw_hotel.includes(searchTerm)
    // });
  }, [tableData]);

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

  const title = typeSelection === 'charges' ? 'Charge Reconciliation' : 'Points Reconciliation';

  return (
    <div className="page-container">
      <FisherhouseHeader title={config.title} description={config.description} />

      <PageHeader />

      <IntroBlock />

      <section className="main-content">
        <div className="container">
          <ListHeader title={title} shouldHaveNewApplicationButton={false}>
            <div className="main-search" id="main-search">
              <Radios
                title="Show: "
                options={[
                  { key: 'charges', value: ' Charges' },
                  { key: 'points', value: ' Points' },
                ]}
                onChange={updateTypeSelection}
                selected={typeSelection}
              />
              <h3>Filters</h3>
              <div className="advanced-search">
                <div className="filters">
                  <ul>
                    {[
                      { key: 'unreconciled', value: 'Unreconciled' },
                      { key: 'reconciled', value: 'Reconciled' },
                    ].map((item) => {
                      if (item.value) {
                        return (
                          <li key={item.key}>
                            <Checkboxfield
                              inputOnChange={updateFilterSelections}
                              label={titleCase(item.value.toLowerCase())}
                              inputValue={item.key}
                              inputChecked={filterSelections.includes(item.key)}
                              labelClassName={'status-' + item.key.toLowerCase()}
                            />
                          </li>
                        );
                      }
                    })}
                    {additionalFilters.map((item, index) => {
                      return <li key={'additional-' + index}>{item}</li>;
                    })}
                  </ul>
                </div>
                <div className="advanced-filters">
                  <Datefield
                    label="Start Date"
                    wrapperClass="start-date"
                    selected={checkinDateStart}
                    onChange={(e) => setCheckinDateStart(e.target.value)}
                  />
                  <Datefield
                    label="End Date"
                    wrapperClass="end-date"
                    selected={checkinDateEnd}
                    onChange={(e) => setCheckinDateEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ListHeader>

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
      </section>
    </div>
  );
}
