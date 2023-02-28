import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import { useRouter } from 'next/router';
import FisherhouseHeader from '@components/FisherhouseHeader';
import config from '../../site.config';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@src/components/IntroBlock';
import { useEffect, useState, useMemo, Fragment, useCallback, useRef } from 'react';
import {
  USERSTATUS,
  APPLICATIONSTATUS,
  AFFILIATIONSTATUS,
  AFFILIATIONTYPE,
  HOTELCHAINSTATUS,
  HOTELBRANDSTATUS,
  GROUPSTATUS,
  BRANCHESOFSERVICE,
  SERVICEMEMBERSTATUS,
  NOTEACTION,
  STAYSTATUS,
  STAYTYPE,
} from '@src/API';
import { Affiliation, HotelChain, HotelBrand } from '@src/models';
import Announcements from '@components/Announcements';
import ListHeader from '@components/ListHeader';
import Radios from '@components/Inputs/Radios';
import Checkboxes from '@components/Inputs/Checkboxes';
import Datefield from '@components/Inputs/Datefield';
import Selectfield from '@components/Inputs/Selectfield';
import Checkboxfield from '@components/Inputs/Checkboxfield';
import ApplicationSearchFormElements from '@components/ApplicationSearchFormElements';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import LiaisonTable from '@components/LiaisonTable';
import NewGroupDialog from '@components/NewGroupDialog';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, DataStore, graphqlOperation, Auth } from 'aws-amplify';
import Link from 'next/link';
import {
  listAffiliations,
  searchAffiliations,
  listHotelChains,
  listHotelBrands,
  listGroups,
  listUsers,
  getConfigurationSettingByName,
  usersByStatus,
  searchNotes,
} from '@src/graphql/queries';
import {
  deleteStay,
  deleteApplication,
  updateApplication,
  updateStay,
} from '@src/graphql/mutations';
import { searchApplicationSearchRecords } from '@src/customQueries/searchApplicationsForTable';
import { searchStaySearchRecords } from '@src/customQueries/searchStaysForTable';
import parseISO from 'date-fns/parseISO';
import humanName from '@utils/humanName';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mapEnumValue } from '@utils/mapEnumValue';
import { CSVDownload, CSVLink } from 'react-csv';
import createNote from '@utils/createNote';
import format from 'date-fns/format';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import useButtonWait from '@contexts/ButtonWaitContext';
import maskLiaisonStayStatus from '@utils/maskLiaisonStayStatus';
import ProgressBar from 'react-percent-bar';

export default function Application() {
  const router = useRouter();
  const { user, profile, isAdministrator, isAuthenticated, isLiaison } = useAuth();
  const { setIsWaiting, isWaiting } = useButtonWait();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [modelTypeToShow, setModelTypeToShow] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [textSearchLimit, setTextSearchLimit] = useState([]);
  const [shouldShowNewGroupDialog, setShouldShowNewGroupDialog] = useState(false);
  const [shouldShowExportFieldsDialog, setShouldShowExportFieldsDialog] = useState(false);
  const [hasHydratedFromURL, setHasHydratedFromURL] = useState(false);
  const [urlForSharing, setUrlForSharing] = useState('');

  const adminApplicationStatusSimple = useMemo(
    () => [
      APPLICATIONSTATUS.REQUESTED,
      APPLICATIONSTATUS.EXCEPTION,
      APPLICATIONSTATUS.APPROVED,
      APPLICATIONSTATUS.COMPLETED,
      APPLICATIONSTATUS.REVIEWED,
    ],
    []
  );

  const adminApplicationStatusAdvanced = useMemo(
    () => [
      APPLICATIONSTATUS.REQUESTED,
      APPLICATIONSTATUS.EXCEPTION,
      APPLICATIONSTATUS.APPROVED,
      APPLICATIONSTATUS.COMPLETED,
      APPLICATIONSTATUS.REVIEWED,
      APPLICATIONSTATUS.DRAFT,
      APPLICATIONSTATUS.CLOSED,
      APPLICATIONSTATUS.RETURNED,
      APPLICATIONSTATUS.DECLINED,
    ],
    []
  );

  const liaisonApplicationStatus = useMemo(
    () => [
      APPLICATIONSTATUS.DRAFT,
      APPLICATIONSTATUS.REQUESTED,
      APPLICATIONSTATUS.EXCEPTION,
      APPLICATIONSTATUS.APPROVED,
      APPLICATIONSTATUS.COMPLETED,
      APPLICATIONSTATUS.RETURNED,
      APPLICATIONSTATUS.DECLINED,
    ],
    []
  );

  const [filterSelections, setFilterSelections] = useState(() => {
    if (isAdministrator()) {
      return [APPLICATIONSTATUS.REQUESTED, APPLICATIONSTATUS.EXCEPTION];
    } else {
      return [
        APPLICATIONSTATUS.DRAFT,
        APPLICATIONSTATUS.REQUESTED,
        APPLICATIONSTATUS.EXCEPTION,
        APPLICATIONSTATUS.RETURNED,
        APPLICATIONSTATUS.APPROVED,
      ];
    }
  });
  const [unreadFilterValue, setUnreadFilterValue] = useState(false);
  const [readFilterValue, setReadFilterValue] = useState(false);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState();
  const [affiliationRestrictionFilterValue, setAffiliationRestrictionFilterValue] = useState([]);
  const [affiliationTypeFilterValue, setAffiliationTypeFilterValue] = useState();
  const [affiliationFilterValue, setAffiliationFilterValue] = useState('');
  const [branchesOfServiceFilterValue, setBranchesOfServiceFilterValue] = useState('');
  const [dutyStatusFilterValue, setDutyStatusFilterValue] = useState('');
  const [baseVaAssignedFilterValue, setBaseVaAssignedFilterValue] = useState('');
  const [treatmentFacilityFilterValue, setTreatmentFacilityFilterValue] = useState('');
  const [hotelChainFilterValue, setHotelChainFilterValue] = useState('');
  const [hotelBrandFilterValue, setHotelBrandFilterValue] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [adminActionUser, setAdminActionUser] = useState('');
  const [adminActionAction, setAdminActionAction] = useState('');
  const [liaisonActionUser, setLiaisonActionUser] = useState('');
  const [liaisonActionAction, setLiaisonActionAction] = useState('');
  const [actionStartDate, setActionStartDate] = useState('');
  const [actionEndDate, setActionEndDate] = useState('');
  const [assignedAdmin, setAssignedAdmin] = useState('');
  const [assignedLiaison, setAssignedLiaison] = useState('');
  const [groupValue, setGroupValue] = useState('');
  const [adminList, setAdminList] = useState([]);
  const [liaisonList, setLiaisonList] = useState([]);
  const [nextToken, setNextToken] = useState('');
  const [pageLimit, setPageLimit] = useState(0);

  const [tableHeaderSort, setTableHeaderSort] = useState();

  const defaultSelectedFields = useMemo(
    () => [
      'stay|reservation_number',
      'stay|actual_check_in',
      'stay|actual_check_out',
      'stay|nights_of_lodging',
      'stay|payment_type',
      'stay|comparable_cost',
      'stay|total_charge',
      'stay|points_used',
      'stay|hotel_chain',
      'stay|hotel_brand',
      'stay|hotel_city',
      'stay|hotel_state',
      'application|liaison_name',
      'application|liaison_affiliation',
      'application|number_of_guests',
      'application|guest_details',
      'application|sm_name',
      'application|sm_branch_of_service',
      'application|sm_status',
      'application|sm_treatment_facility',
      'application|narrative_and_exceptions',
    ],
    []
  );
  const [selectedExportFields, setSelectedExportFields] = useState(defaultSelectedFields);
  const [exportDialogCloseButtonsDisabled, setExportDialogCloseButtonsDisabled] = useState(false);
  const [exportDialogSubmitButtonDisabled, setExportDialogSubmitButtonDisabled] = useState(false);
  const [shouldRenderDownload, setShouldRenderDownload] = useState(false);
  const [CSVDATA, setCSVData] = useState([]);
  const [CSVHeaders, setCSVHeaders] = useState([]);
  const [csvDownloadCounter, setCsvDownloadCounter] = useState(0);
  const csvDownloadLinkRef = useRef(null);

  const [percent, setPercent] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const filterOptions = useMemo(() => {
    if (isAdministrator()) {
      if (advancedSearchVisible) {
        return adminApplicationStatusAdvanced.map((val) => {
          return {
            key: val,
            value: val,
          };
        });
      } else {
        return adminApplicationStatusSimple.map((val) => {
          return {
            key: val,
            value: val,
          };
        });
      }
    } else {
      return liaisonApplicationStatus.map((val) => {
        return {
          key: val,
          value: val,
        };
      });
    }
  }, [
    isAdministrator,
    advancedSearchVisible,
    adminApplicationStatusAdvanced,
    adminApplicationStatusSimple,
    liaisonApplicationStatus,
  ]);

  const exportFieldOptions = useMemo(() => {
    return [
      { key: 'stay|id', value: 'Stay ID' },
      { key: 'stay|status', value: 'Stay Status' },
      { key: 'stay|requested_check_in', value: 'Requested Check In' },
      { key: 'stay|requested_check_out', value: 'Requested Check Out' },
      { key: 'stay|narrative', value: 'Stay Narrative' },
      { key: 'stay|special_requests', value: 'Special Requests' },
      { key: 'stay|reservation_number', value: 'Confirmation Number' },
      { key: 'stay|actual_check_in', value: 'Actual Check In' },
      { key: 'stay|actual_check_out', value: 'Actual Check Out' },
      { key: 'stay|nights_of_lodging', value: 'Nights of Lodging' },
      { key: 'stay|change_reason', value: 'Dates Change Reason' },
      { key: 'stay|room_type', value: 'Room Type' },
      { key: 'stay|room_description', value: 'Room Description' },
      { key: 'stay|payment_type', value: 'Payment Type' },
      { key: 'stay|comparable_cost', value: 'Comparable Cost' },
      { key: 'stay|total_charge', value: 'Total Charge' },
      { key: 'stay|card_name', value: 'Card Name' },
      { key: 'stay|certificate_number', value: 'Custom Payment Information' },
      { key: 'stay|points_used', value: 'Points Used' },
      // { key: 'stay|card_name', value: 'Card Name' },
      { key: 'stay|charge_reconcile', value: 'Credit Card Reconciled' },
      { key: 'stay|hotel_reconcile', value: 'Hotel Folio Reconciled' },
      { key: 'stay|custom_payment_reconcile', value: 'Custom Payment Reconciled' },
      { key: 'stay|points_reconcile', value: 'Points Reconciled' },
      { key: 'stay|created_at', value: 'Stay Created' },
      { key: 'stay|updated_at', value: 'Stay Updated' },
      { key: 'stay|hotel_chain', value: 'Hotel Chain' },
      { key: 'stay|hotel_brand', value: 'Hotel Brand' },
      { key: 'stay|hotel_property', value: 'Hotel Property' },
      { key: 'stay|hotel_city', value: 'Hotel City' },
      { key: 'stay|hotel_state', value: 'Hotel State' },
      { key: 'stay|hotel_contact_name', value: 'Hotel Contact Name' },
      { key: 'stay|hotel_contact_email', value: 'Hotel Contact Email' },
      { key: 'stay|hotel_contact_telephone', value: 'Hotel Contact Telephone' },
      { key: 'stay|hotel_contact_extension', value: 'Hotel Contact Extension' },
      // { key: 'stay|date_approved', value: 'Date Approved' },
      { key: 'application|id', value: 'Application ID' },
      { key: 'application|status', value: 'Application Status' },
      { key: 'application|liaison_name', value: 'Assigned Liaison' },
      { key: 'application|liaison_affiliation', value: 'Liaison Affiliation' },
      { key: 'application|assigned_to', value: 'Assigned Admin' },
      { key: 'application|base_va_name', value: 'Base or VA Name' },
      // { key: 'application|special_requests', value: 'Special Requests' },
      { key: 'application|number_of_guests', value: 'Number of Guests' },
      { key: 'application|guest_details', value: 'Guest Details' },
      { key: 'application|guest_email', value: 'Primary Guest Email' },
      { key: 'application|guest_telephone', value: 'Primary Guest Telephone' },
      { key: 'application|guest_extension', value: 'Primary Guest Extension' },
      { key: 'application|exception_narrative', value: 'Exception Narrative' },
      { key: 'application|created_at', value: 'Application Created' },
      { key: 'application|updated_at', value: 'Application Updated' },
      // { key: 'application|case_details', value: 'Case Details' },
      { key: 'application|referral', value: 'Referral?' },
      { key: 'application|referrer_name', value: 'Referrer Name' },
      { key: 'application|referrer_email', value: 'Referrer Email' },
      { key: 'application|referrer_telephone', value: 'Referrer Telephone' },
      { key: 'application|referrer_extension', value: 'Referrer Extension' },
      { key: 'application|referrer_title', value: 'Referrer Title' },
      { key: 'application|referrer_affiliation', value: 'Referrer Affiliation' },
      { key: 'application|sm_name', value: 'Service Member Name' },
      { key: 'application|sm_email', value: 'Service Member Email' },
      { key: 'application|sm_telephone', value: 'Service Member Telephone' },
      { key: 'application|sm_extension', value: 'Service Member Extension' },
      { key: 'application|sm_branch_of_service', value: 'Branch of Service' },
      { key: 'application|sm_status', value: 'Current Status' },
      {
        key: 'application|sm_on_travel_orders',
        value:
          "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      },
      { key: 'application|sm_military_order_explanation', value: 'Military Orders Explanation' },
      {
        key: 'application|sm_other_patient',
        value: 'Is the patient someone other than the Service Member?',
      },
      { key: 'application|patient_name', value: 'Patient Name' },
      { key: 'application|patient_relationship', value: 'Patient Relationship' },
      { key: 'application|sm_treatment_facility', value: 'Treatment Facility' },
      { key: 'application|narrative_and_exceptions', value: 'Narrative and Exceptions' },
    ];
  }, []);

  const { setMessage } = useDialog();

  const isSmallScreen = useMediaQuery({ maxWidth: 560 });

  const resetSearch = (e) => {
    e.preventDefault();
    if (isAdministrator()) {
      setFilterSelections([APPLICATIONSTATUS.REQUESTED, APPLICATIONSTATUS.EXCEPTION]);
    } else {
      setFilterSelections([
        APPLICATIONSTATUS.DRAFT,
        APPLICATIONSTATUS.REQUESTED,
        APPLICATIONSTATUS.EXCEPTION,
        APPLICATIONSTATUS.RETURNED,
        APPLICATIONSTATUS.APPROVED,
      ]);
    }
    // setModelTypeToShow('applications');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setFirstName('');
    setLastName('');
    setConfirmationNumber('');
    setUnreadFilterValue(false);
    setReadFilterValue(false);
    setAffiliationFilterValue();
    setAffiliationTypeFilterValue();
    setHotelChainFilterValue();
    setHotelBrandFilterValue();
    setDateFilter();
    setCheckinDate();
    setCheckoutDate();
    setAdminActionUser();
    setAdminActionAction();
    setLiaisonActionUser();
    setLiaisonActionAction();
    setActionStartDate();
    setActionEndDate();
    setAssignedAdmin();
    setAssignedLiaison();
    setGroupValue();
    setAffiliationRestrictionFilterValue([]);
    setBranchesOfServiceFilterValue();
    setDutyStatusFilterValue();
    setBaseVaAssignedFilterValue();
    setTreatmentFacilityFilterValue();
    setTextSearchLimit([]);
    setAdvancedSearchVisible(false);
    setTableHeaderSort({ key: 'header_checkin', isSorted: false, ascending: true });
    window.scrollTo(0, 0);
  };

  const updateModelTypeToShow = (e) => {
    setModelTypeToShow(e.target.value);
    if (e.target.value == 'groups') {
      router.push('/application/group');
    }
  };

  // Persist filters to storage and URL.
  useEffect(() => {
    /**
     *  NOTE: Javascript doesn't have explicit pass by reference but does it for objects.
     *  searchParams
     */
    const updateOrDeleteSearchParamInUrl = (searchParams, name, value) => {
      if (value) {
        searchParams.set(name, JSON.stringify(value));
      } else {
        searchParams.delete(name);
      }
    };

    if (hasHydratedFromURL) {
      const urlToUpdate = new URL(window.location);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'type', modelTypeToShow);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'start', startDate);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'end', endDate);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'term', searchTerm);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'firstName', firstName);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'lastName', lastName);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'confirmationNumber', confirmationNumber);
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'status',
        filterSelections.join('|')
      );
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'unread', unreadFilterValue);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'read', readFilterValue);
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'affiliation',
        affiliationFilterValue
      );
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'affiliationtype',
        affiliationTypeFilterValue
      );
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'textSearchLimit', textSearchLimit);
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'branchesOfService',
        branchesOfServiceFilterValue
      );
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'dutyStatus', dutyStatusFilterValue);
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'baseVaAssigned',
        baseVaAssignedFilterValue
      );
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'treatmentFacility',
        treatmentFacilityFilterValue
      );
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'hotelchain', hotelChainFilterValue);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'hotelbrand', hotelBrandFilterValue);
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'affiliationRestriction',
        affiliationRestrictionFilterValue
      );
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'datefilter', dateFilter);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'checkin', checkinDate);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'checkout', checkoutDate);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'adminActionUser', adminActionUser);
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'adminActionAction',
        adminActionAction
      );
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'liaisonActionUser',
        liaisonActionUser
      );
      updateOrDeleteSearchParamInUrl(
        urlToUpdate.searchParams,
        'liaisonActionAction',
        liaisonActionAction
      );
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'actionStartDate', actionStartDate);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'actionEndDate', actionEndDate);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'admin', assignedAdmin);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'liaison', assignedLiaison);
      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'group', groupValue);

      updateOrDeleteSearchParamInUrl(urlToUpdate.searchParams, 'tableHeaderSort', tableHeaderSort);

      // router.push(urlToUpdate, undefined, { shallow: true });
      localStorage.setItem('search-params', urlToUpdate.searchParams);
      setUrlForSharing(urlToUpdate.toString());
    }
  }, [
    hasHydratedFromURL,
    assignedLiaison,
    assignedAdmin,
    groupValue,
    filterSelections,
    hotelChainFilterValue,
    hotelBrandFilterValue,
    textSearchLimit,
    searchTerm,
    firstName,
    lastName,
    confirmationNumber,
    branchesOfServiceFilterValue,
    dutyStatusFilterValue,
    affiliationFilterValue,
    affiliationRestrictionFilterValue,
    baseVaAssignedFilterValue,
    treatmentFacilityFilterValue,
    filterOptions,
    isAdministrator,
    adminActionAction,
    adminActionUser,
    liaisonActionAction,
    liaisonActionUser,
    actionStartDate,
    actionEndDate,
    readFilterValue,
    unreadFilterValue,
    modelTypeToShow,
    dateFilter,
    checkinDate,
    checkoutDate,
    adminApplicationStatusAdvanced.length,
    liaisonApplicationStatus.length,
    affiliationTypeFilterValue,
    endDate,
    router,
    startDate,
    tableHeaderSort,
  ]);

  // Load defaults from URL on pageload.
  useEffect(() => {
    if (!hasHydratedFromURL && router.isReady) {
      setHasHydratedFromURL(true);
      let query = router.query;
      if (Object.keys(query).length == 0) {
        const params = localStorage.getItem('search-params');
        if (params) {
          query = Object.fromEntries(new URLSearchParams(params));
        }
      }
      try {
        if (query.type && JSON.parse(query.type) === 'stays') {
          setModelTypeToShow('stays');
        } else if (query.type && JSON.parse(query.type) === 'groups') {
          setModelTypeToShow('groups');
          router.push('/application/group');
        } else {
          setModelTypeToShow('applications');
        }
        if (query.start) {
          const parsedStartDate = parseISO(JSON.parse(query.start));
          if (parsedStartDate != 'Invalid Date') {
            setStartDate(parsedStartDate);
            setAdvancedSearchVisible(true);
          }
        }
        if (query.end) {
          const parsedEndDate = parseISO(JSON.parse(query.end));
          if (parsedEndDate != 'Invalid Date') {
            setEndDate(parsedEndDate);
            setAdvancedSearchVisible(true);
          }
        }
        if (query.term) {
          setSearchTerm(JSON.parse(query.term));
        }
        if (query.firstName) {
          setFirstName(JSON.parse(query.firstName));
        }
        if (query.lastName) {
          setLastName(JSON.parse(query.lastName));
        }
        if (query.confirmationNumber) {
          setConfirmationNumber(JSON.parse(query.confirmationNumber));
        }
        if (query.status) {
          const filterSelectionsFromURL = JSON.parse(query.status).split('|');
          const filterSelection = filterSelectionsFromURL.filter((item) =>
            Object.values(APPLICATIONSTATUS).includes(item)
          );
          var uniqueFilterSelection = [...new Set(filterSelection)];

          if (isLiaison()) {
            if (uniqueFilterSelection.includes(APPLICATIONSTATUS.COMPLETED)) {
              uniqueFilterSelection.push(APPLICATIONSTATUS.REVIEWED);
              uniqueFilterSelection.push(APPLICATIONSTATUS.CLOSED);
            } else {
              uniqueFilterSelection = uniqueFilterSelection.filter(
                (item) => item !== APPLICATIONSTATUS.REVIEWED && item !== APPLICATIONSTATUS.CLOSED
              );
            }
          }

          if (uniqueFilterSelection.includes(APPLICATIONSTATUS.DRAFT)) {
            setAdvancedSearchVisible(true);
          }
          if (uniqueFilterSelection.includes(APPLICATIONSTATUS.CLOSED)) {
            setAdvancedSearchVisible(true);
          }
          if (uniqueFilterSelection.includes(APPLICATIONSTATUS.RETURNED)) {
            setAdvancedSearchVisible(true);
          }
          if (uniqueFilterSelection.includes(APPLICATIONSTATUS.DECLINED)) {
            setAdvancedSearchVisible(true);
          }
          setFilterSelections(uniqueFilterSelection);
        } else {
          setFilterSelections([]);
        }
        if (query.unread) {
          setUnreadFilterValue(true);
        }
        if (query.unread && query.inbox) {
          setFilterSelections([]);
          setStartDate('');
          setEndDate('');
          setSearchTerm('');
          setFirstName('');
          setLastName('');
          setConfirmationNumber('');
          setUnreadFilterValue(true);
          setReadFilterValue(false);
          setAffiliationFilterValue();
          setAffiliationTypeFilterValue();
          setHotelChainFilterValue();
          setHotelBrandFilterValue();
          setDateFilter();
          setCheckinDate();
          setCheckoutDate();
          setAdminActionUser();
          setAdminActionAction();
          setLiaisonActionUser();
          setLiaisonActionAction();
          setActionStartDate();
          setActionEndDate();
          setAssignedAdmin();
          setAssignedLiaison();
          setGroupValue();
          setAffiliationRestrictionFilterValue([]);
          setBranchesOfServiceFilterValue();
          setDutyStatusFilterValue();
          setBaseVaAssignedFilterValue();
          setTreatmentFacilityFilterValue();
          setTextSearchLimit();
          setAdvancedSearchVisible(false);
        }
        if (query.read) {
          setReadFilterValue(true);
        }
        if (query.affiliation) {
          setAffiliationFilterValue(JSON.parse(query.affiliation));
          setAdvancedSearchVisible(true);
        }
        if (query.affiliationtype) {
          setAffiliationTypeFilterValue(JSON.parse(query.affiliationtype));
          setAdvancedSearchVisible(true);
        }
        if (query.textSearchLimit) {
          setTextSearchLimit(JSON.parse(query.textSearchLimit));
          if (
            JSON.parse(query.textSearchLimit) &&
            Array.isArray(JSON.parse(query.textSearchLimit)) &&
            JSON.parse(query.textSearchLimit).length > 0
          ) {
            setAdvancedSearchVisible(true);
          } else {
            setAdvancedSearchVisible(false);
          }
        }
        if (query.branchesOfService) {
          setBranchesOfServiceFilterValue(JSON.parse(query.branchesOfService));
          setAdvancedSearchVisible(true);
        }
        if (query.dutyStatus) {
          setDutyStatusFilterValue(JSON.parse(query.dutyStatus));
          setAdvancedSearchVisible(true);
        }
        if (query.baseVaAssigned) {
          setBaseVaAssignedFilterValue(JSON.parse(query.baseVaAssigned));
          setAdvancedSearchVisible(true);
        }
        if (query.treatmentFacility) {
          setTreatmentFacilityFilterValue(JSON.parse(query.treatmentFacility));
          setAdvancedSearchVisible(true);
        }
        if (query.affiliationRestriction) {
          setAffiliationRestrictionFilterValue(JSON.parse(query.affiliationRestriction));
          if (
            JSON.parse(query.affiliationRestriction) &&
            Array.isArray(JSON.parse(query.affiliationRestriction)) &&
            JSON.parse(query.affiliationRestriction).length > 0
          ) {
            setAdvancedSearchVisible(true);
          }
        }
        if (query.hotelchain) {
          setHotelChainFilterValue(JSON.parse(query.hotelchain));
          setAdvancedSearchVisible(true);
        }
        if (query.hotelbrand) {
          setHotelBrandFilterValue(JSON.parse(query.hotelbrand));
          setAdvancedSearchVisible(true);
        }
        if (query.datefilter) {
          setDateFilter(JSON.parse(query.datefilter));
          setAdvancedSearchVisible(true);
        }
        if (query.checkin) {
          setCheckinDate(JSON.parse(query.checkin));
          setAdvancedSearchVisible(true);
        }
        if (query.checkout) {
          setCheckoutDate(JSON.parse(query.checkout));
          setAdvancedSearchVisible(true);
        }
        if (query.adminActionUser) {
          setAdminActionUser(JSON.parse(query.adminActionUser));
          setAdvancedSearchVisible(true);
        }
        if (query.adminActionAction) {
          setAdminActionAction(JSON.parse(query.adminActionAction));
          setAdvancedSearchVisible(true);
        }
        if (query.liaisonActionUser) {
          setLiaisonActionUser(JSON.parse(query.liaisonActionUser));
          setAdvancedSearchVisible(true);
        }
        if (query.liaisonActionAction) {
          setLiaisonActionAction(JSON.parse(query.liaisonActionAction));
          setAdvancedSearchVisible(true);
        }
        if (query.actionStartDate) {
          setActionStartDate(JSON.parse(query.actionStartDate));
          setAdvancedSearchVisible(true);
        }
        if (query.actionEndDate) {
          setActionEndDate(JSON.parse(query.actionEndDate));
          setAdvancedSearchVisible(true);
        }
        if (query.admin) {
          setAssignedAdmin(JSON.parse(query.admin));
          setAdvancedSearchVisible(true);
        }
        if (query.liaison) {
          setAssignedLiaison(JSON.parse(query.liaison));
          setAdvancedSearchVisible(true);
        }
        if (query.group) {
          setGroupValue(JSON.parse(query.group));
          setAdvancedSearchVisible(true);
        }
        if (query.tableHeaderSort) {
          setTableHeaderSort(JSON.parse(query.tableHeaderSort));
        }
      } catch (e) {
        console.log('Error parsing saved search', e);
      }
    }
  }, [hasHydratedFromURL, router.isReady, router.query, router, isLiaison]);

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

  const handleAdvancedSearchClick = (e) => {
    e.preventDefault();
    setAdvancedSearchVisible(!advancedSearchVisible);
  };

  const getFisherHouses = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(Affiliation, (c) => c.type('eq', AFFILIATIONTYPE.FISHERHOUSE)).then(
          (items) => {
            resolve(
              items.map((item) => {
                return { value: item.id, label: item.name };
              })
            );
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(searchAffiliations, {
            filter: {
              type: { eq: AFFILIATIONTYPE.FISHERHOUSE },
              or: [
                { status: { eq: AFFILIATIONSTATUS.ARCHIVED } },
                { status: { eq: AFFILIATIONSTATUS.ACTIVE } },
              ],
            },
          })
        ).then((results) => {
          resolve(
            results.data.searchAffiliations.items
              .map((item) => {
                if (item.status == AFFILIATIONSTATUS.ARCHIVED) {
                  return { value: item.id, label: 'ARCHIVED - ' + item.name, status: item.status };
                } else {
                  return { value: item.id, label: item.name, status: item.status };
                }
              })
              .sort((a, b) => {
                if (a.status == b.status) {
                  return a.label.localeCompare(b.label);
                } else {
                  if (
                    a.status == AFFILIATIONSTATUS.ARCHIVED &&
                    b.status == AFFILIATIONSTATUS.ACTIVE
                  ) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              })
          );
        });
      });
    }
  };

  const getMedicalCenters = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(Affiliation, (c) => c.type('eq', AFFILIATIONTYPE.MEDICALCENTER)).then(
          (items) => {
            resolve(
              items.map((item) => {
                return { value: item.id, label: item.name };
              })
            );
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(searchAffiliations, {
            filter: {
              type: { eq: AFFILIATIONTYPE.MEDICALCENTER },
              or: [
                { status: { eq: AFFILIATIONSTATUS.ARCHIVED } },
                { status: { eq: AFFILIATIONSTATUS.ACTIVE } },
              ],
            },
            limit: 9999,
          })
        ).then((results) => {
          resolve(
            results.data.searchAffiliations.items
              .map((item) => {
                if (item.status == AFFILIATIONSTATUS.ARCHIVED) {
                  return { value: item.id, label: 'ARCHIVED - ' + item.name, status: item.status };
                } else {
                  return { value: item.id, label: item.name, status: item.status };
                }
              })
              .sort((a, b) => {
                if (a.status == b.status) {
                  return a.label.localeCompare(b.label);
                } else {
                  if (
                    a.status == AFFILIATIONSTATUS.ARCHIVED &&
                    b.status == AFFILIATIONSTATUS.ACTIVE
                  ) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              })
          );
        });
      });
    }
  };

  const getBases = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(Affiliation, (c) => c.type('eq', AFFILIATIONTYPE.BASE)).then((items) => {
          resolve(
            items.map((item) => {
              return { value: item.id, label: item.name };
            })
          );
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(searchAffiliations, {
            filter: {
              type: { eq: AFFILIATIONTYPE.BASE },
              or: [
                { status: { eq: AFFILIATIONSTATUS.ARCHIVED } },
                { status: { eq: AFFILIATIONSTATUS.ACTIVE } },
              ],
            },
          })
        ).then((results) => {
          resolve(
            results.data.searchAffiliations.items
              .map((item) => {
                if (item.status == AFFILIATIONSTATUS.ARCHIVED) {
                  return { value: item.id, label: 'ARCHIVED - ' + item.name, status: item.status };
                } else {
                  return { value: item.id, label: item.name, status: item.status };
                }
              })
              .sort((a, b) => {
                if (a.status == b.status) {
                  return a.label.localeCompare(b.label);
                } else {
                  if (
                    a.status == AFFILIATIONSTATUS.ARCHIVED &&
                    b.status == AFFILIATIONSTATUS.ACTIVE
                  ) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              })
          );
        });
      });
    }
  };

  const getOrganizations = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(Affiliation, (c) => c.type('eq', AFFILIATIONTYPE.ORGANIZATION)).then(
          (items) => {
            resolve(
              items.map((item) => {
                return { value: item.id, label: item.name };
              })
            );
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(searchAffiliations, {
            filter: {
              type: { eq: AFFILIATIONTYPE.ORGANIZATION },
              or: [
                { status: { eq: AFFILIATIONSTATUS.ARCHIVED } },
                { status: { eq: AFFILIATIONSTATUS.ACTIVE } },
              ],
            },
          })
        ).then((results) => {
          resolve(
            results.data.searchAffiliations.items
              .map((item) => {
                if (item.status == AFFILIATIONSTATUS.ARCHIVED) {
                  return { value: item.id, label: 'ARCHIVED - ' + item.name, status: item.status };
                } else {
                  return { value: item.id, label: item.name, status: item.status };
                }
              })
              .sort((a, b) => {
                if (a.status == b.status) {
                  return a.label.localeCompare(b.label);
                } else {
                  if (
                    a.status == AFFILIATIONSTATUS.ARCHIVED &&
                    b.status == AFFILIATIONSTATUS.ACTIVE
                  ) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              })
          );
        });
      });
    }
  };

  const getHotelChains = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(HotelChain, Predicates.ALL).then((items) => {
          resolve(
            items.map((item) => {
              return { value: item.id, label: item.name };
            })
          );
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(listHotelChains, {
            limit: 100000,
            filter: { status: { ne: HOTELCHAINSTATUS.DRAFT } },
          })
        ).then((results) => {
          const hotelChains = results.data.listHotelChains.items.sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          const archivedChains = hotelChains
            .filter((item) => item.status === HOTELCHAINSTATUS.ARCHIVED)
            .map((item) => {
              return { value: item.id, label: `ARCHIVED - ${item.name}` };
            });
          const activeChains = hotelChains
            .filter((item) => item.status === HOTELCHAINSTATUS.ACTIVE)
            .map((item) => {
              return { value: item.id, label: item.name };
            });
          resolve([...activeChains, ...archivedChains]);
        });
      });
    }
  };

  const getHotelBrands = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(HotelBrand, Predicates.ALL).then((items) => {
          resolve(
            items.map((item) => {
              return { value: item.id, label: item.name };
            })
          );
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(listHotelBrands, {
            limit: 100000,
            filter: { status: { ne: HOTELBRANDSTATUS.DRAFT } },
          })
        ).then((results) => {
          const hotelBrands = results.data.listHotelBrands.items.sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          const archivedBrands = hotelBrands
            .filter((item) => item.status === HOTELBRANDSTATUS.ARCHIVED)
            .map((item) => {
              return { value: item.id, label: `ARCHIVED - ${item.name}` };
            });
          const activeBrands = hotelBrands
            .filter((item) => item.status === HOTELBRANDSTATUS.ACTIVE)
            .map((item) => {
              return { value: item.id, label: item.name };
            });
          resolve([...activeBrands, ...archivedBrands]);
        });
      });
    }
  };

  const getGroups = (input) => {
    if (shouldUseDatastore()) {
      return new Promise((resolve, reject) => {
        DataStore.query(Group, Predicates.ALL).then((items) => {
          const sortedResults = [...items].sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          const activeGroups = sortedResults
            .filter((item) => item.status === GROUPSTATUS.ACTIVE)
            .map((item) => {
              return { value: item.id, label: item.name };
            });
          const archivedGroups = sortedResults
            .filter((item) => item.status === GROUPSTATUS.ARCHIVED)
            .map((item) => {
              return { value: item.id, label: `ARCHIVED - ${item.name}` };
            });
          resolve([...activeGroups, ...archivedGroups]);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        API.graphql(
          graphqlOperation(listGroups, {
            limit: 100000,
            filter: { status: { ne: GROUPSTATUS.DRAFT } },
          })
        ).then((results) => {
          const sortedResults = [...results.data.listGroups.items].sort((a, b) =>
            a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          const activeGroups = sortedResults
            .filter((item) => item.status === GROUPSTATUS.ACTIVE)
            .map((item) => {
              return { value: item.id, label: item.name };
            });
          const archivedGroups = sortedResults
            .filter((item) => item.status === GROUPSTATUS.ARCHIVED)
            .map((item) => {
              return { value: item.id, label: `ARCHIVED - ${item.name}` };
            });
          resolve([...activeGroups, ...archivedGroups]);
        });
      });
    }
  };

  const getUsersInGroup = useCallback(async (groupname, token) => {
    let results = await API.get('AdminQueries', '/listUsersInGroup', {
      queryStringParameters: {
        groupname,
        limit: 50,
        token,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    });

    let finalResults = [];
    if (results.NextToken && results.NextToken.length > 0) {
      const moreResults = await getUsersInGroup(groupname, results.NextToken);
      finalResults = results.Users.concat(moreResults);
    } else {
      finalResults = results.Users;
    }
    return finalResults;
  }, []);

  const getAdmins = useCallback(() => {
    return new Promise((resolve, reject) => {
      getUsersInGroup('Administrators', '')
        .then((results) => {
          const emailAddressResults = results.map((item) => {
            const emailAttribute = item.Attributes.find((i) => {
              return i['Name'] == 'email';
            });
            return emailAttribute.Value;
          });

          API.graphql(
            graphqlOperation(listUsers, {
              filter: {
                or: [
                  ...emailAddressResults.map((item) => {
                    return { username: { eq: item } };
                  }),
                ],
              },
            })
          )
            .then((userResults) => {
              resolve(
                userResults.data.listUsers.items.map((item) => {
                  return { value: item.id, label: humanName(item) };
                })
              );
            })
            .catch((err) => {
              resolve([]);
            });
        })
        .catch((err) => {
          resolve([]);
        });
    });
  }, [getUsersInGroup]);

  const getAllUsers = async () => {
    const results = await API.graphql(
      graphqlOperation(listUsers, {
        filter: {
          or: [
            {
              status: { eq: USERSTATUS.ACTIVE },
            },
            {
              status: { eq: USERSTATUS.INACTIVE },
            },
          ],
        },
        limit: 99999,
      })
    );

    return results.data.listUsers.items;
  };

  const getAdminsAsLiaison = useCallback(() => {
    const getAdminsInGroup = async () => {
      let results = await API.get('Utils', '/utils/admins', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return results;
    };

    const getActiveAllUsers = async (token) => {
      const results = await API.graphql(
        graphqlOperation(usersByStatus, {
          status: USERSTATUS.ACTIVE,
          nextToken: token,
          limit: 99999,
        })
      );

      let finalResults = [];
      if (results.data.UsersByStatus.nextToken) {
        const moreResults = getActiveAllUsers(results.data.UsersByStatus.nextToken);
        finalResults = results.data.UsersByStatus.items.concat(moreResults);
      } else {
        finalResults = results.data.UsersByStatus.items;
      }

      return finalResults;
    };

    const getInActiveAllUsers = async (token) => {
      const results = await API.graphql(
        graphqlOperation(usersByStatus, {
          status: USERSTATUS.INACTIVE,
          nextToken: token,
          limit: 99999,
        })
      );

      let finalResults = [];
      if (results.data.UsersByStatus.nextToken) {
        const moreResults = getInActiveAllUsers(results.data.UsersByStatus.nextToken);
        finalResults = results.data.UsersByStatus.items.concat(moreResults);
      } else {
        finalResults = results.data.UsersByStatus.items;
      }

      return finalResults;
    };

    return new Promise((resolve, reject) => {
      Promise.all([getAdminsInGroup(), getAllUsers()]).then((values) => {
        const adminIds = values[0].sort((a, b) =>
          humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        );
        // const activeUsers = values[1].sort((a, b) =>
        //   humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        // );
        // const inActiveUsers = values[2].sort((a, b) =>
        //   humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        // );

        // const users = [...activeUsers, ...inActiveUsers];
        const users = values[1].sort((a, b) =>
          humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        );

        resolve(
          users
            .filter((item) => adminIds.includes(item.owner))
            .map((item) => {
              return { value: item.id, label: humanName(item) };
            })
        );
      });
    });
  }, []);

  const getLiaisons = useCallback(() => {
    const getAdminsInGroup = async () => {
      let results = await API.get('Utils', '/utils/admins', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return results;
    };

    return new Promise((resolve, reject) => {
      Promise.all([getAdminsInGroup(), getAllUsers()]).then((values) => {
        const adminIds = values[0].sort((a, b) =>
          humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
        );
        let users = [];
        if (isAdministrator()) {
          users = values[1].sort((a, b) =>
            humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
          );
        } else {
          users = values[1]
            .sort((a, b) =>
              humanName(a)?.localeCompare(humanName(b), undefined, { sensitivity: 'base' })
            )
            .filter((item) => item?.AffiliationID === profile?.AffiliationID);
        }
        users = users.filter(
          (item, index, self) => index === self.findIndex((t) => t.username === item.username)
        );
        users = users.filter((item) => !item._deleted && item.id);
        resolve(
          users
            .filter((item) => !adminIds.includes(item.owner))
            .map((item) => {
              return { value: item.id, label: humanName(item) };
            })
        );
      });
    });
  }, [profile, isAdministrator]);

  useEffect(() => {
    getAdminsAsLiaison().then((admins) => {
      setAdminList(admins);
    });
  }, [getAdminsAsLiaison]);

  useEffect(() => {
    getLiaisons().then((liaisons) => {
      setLiaisonList(liaisons);
    });
  }, [getLiaisons]);

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

  const getAllNotesWithGivenInput = useCallback(
    async (
      adminActionUser,
      adminActionAction,
      liaisonActionUser,
      liaisonActionAction,
      actionUTCStartDateFilter,
      actionUTCEndDateFilter,
      token
    ) => {
      let noteFilters = {};
      noteFilters['and'] = [];
      if (adminActionUser) {
        noteFilters['and'].push({ noteUserId: { eq: adminActionUser?.value } });
      }
      if (adminActionAction) {
        noteFilters['and'].push({ action: { eq: adminActionAction?.value } });
        if (!adminActionUser) {
          noteFilters['and'].push({
            or: adminList.map((item) => ({ noteUserId: { eq: item.value } })),
          });
        }
      }
      if (liaisonActionUser) {
        noteFilters['and'].push({ noteUserId: { eq: liaisonActionUser?.value } });
      }
      if (liaisonActionAction) {
        noteFilters['and'].push({ action: { eq: liaisonActionAction?.value } });
        if (!liaisonActionUser) {
          noteFilters['and'].push({
            or: adminList.map((item) => ({ noteUserId: { ne: item.value } })),
          });
        }
      }
      if (actionStartDate) {
        noteFilters['and'].push({ timestamp: { gte: actionUTCStartDateFilter } });
      }
      if (actionEndDate) {
        noteFilters['and'].push({ timestamp: { lte: actionUTCEndDateFilter } });
      }

      const results = await API.graphql(
        graphqlOperation(searchNotes, { filter: noteFilters, limit: 500, nextToken: token })
      );

      let finalResults = [];
      if (results.data.searchNotes.nextToken) {
        const moreResults = await getAllNotesWithGivenInput(
          adminActionUser,
          adminActionAction,
          liaisonActionUser,
          liaisonActionAction,
          actionUTCStartDateFilter,
          actionUTCEndDateFilter,
          results.data.searchNotes.nextToken
        );

        finalResults = results.data.searchNotes.items.concat(moreResults);
      } else {
        finalResults = results.data.searchNotes.items;
      }

      return finalResults;
    },
    [actionEndDate, actionStartDate, adminList]
  );

  const generateFilters = useCallback(async () => {
    let applicationIdRestrictions = [];
    if (
      adminActionUser ||
      adminActionAction ||
      liaisonActionUser ||
      liaisonActionAction ||
      actionStartDate ||
      actionEndDate
    ) {
      applicationIdRestrictions = await getAllNotesWithGivenInput(
        adminActionUser,
        adminActionAction,
        liaisonActionUser,
        liaisonActionAction,
        actionStartDate,
        actionEndDate,
        null
      );
    }

    let filters = {};
    if (unreadFilterValue || readFilterValue) {
      if (unreadFilterValue && readFilterValue) {
        // We want both, no need to filter
      } else if (unreadFilterValue) {
        if (isAdministrator()) {
          filters['adminIsUnread'] = { eq: true };
        } else {
          filters['liaisonIsUnread'] = { eq: true };
        }
      } else if (readFilterValue) {
        if (isAdministrator()) {
          filters['adminIsUnread'] = { ne: true };
        } else {
          filters['liaisonIsUnread'] = { ne: true };
        }
      } else {
        // Neither is checked... which means show both. No need to filter.
      }
    }
    if (filterSelections.length > 0) {
      let filtersToMap = filterSelections;
      if (isLiaison()) {
        if (filterSelections.includes(APPLICATIONSTATUS.COMPLETED)) {
          if (!filterSelections.includes(APPLICATIONSTATUS.REVIEWED)) {
            filtersToMap.push(APPLICATIONSTATUS.REVIEWED);
          }
          if (!filterSelections.includes(APPLICATIONSTATUS.CLOSED)) {
            filtersToMap.push(APPLICATIONSTATUS.CLOSED);
          }
        }
      }
      filtersToMap = [...new Set(filtersToMap)];
      filters['not'] = {
        not: {
          or: filtersToMap
            .map((item) => {
              if (isLiaison()) {
                if (
                  [
                    ...filterOptions,
                    { key: APPLICATIONSTATUS.REVIEWED, value: APPLICATIONSTATUS.REVIEWED },
                    { key: APPLICATIONSTATUS.CLOSED, value: APPLICATIONSTATUS.CLOSED },
                  ]
                    .map((i) => i.key)
                    .includes(item)
                ) {
                  if (modelTypeToShow == 'stays') {
                    return { staysStatus: { eq: item } };
                  } else {
                    return { applicationStatus: { eq: item } };
                  }
                }
              } else {
                if ([...filterOptions].map((i) => i.key).includes(item)) {
                  if (modelTypeToShow == 'stays') {
                    return { staysStatus: { eq: item } };
                  } else {
                    return { applicationStatus: { eq: item } };
                  }
                }
              }
            })
            .filter((item) => item != null),
        },
      };
    }

    if (firstName.length > 0 || lastName.length > 0) {
      if (firstName.length > 0 && lastName.length > 0) {
        const strippedFirstName = firstName.replace(/  +/g, ' ');
        const strippedLastName = lastName.replace(/  +/g, ' ');
        if (textSearchLimit.length > 0) {
          if (textSearchLimit.indexOf('service_member') >= 0 && textSearchLimit.indexOf('guests') >= 0) {
            filters['or'] = [];
            filters['or'].push({ and: [{ serviceMemberFirstName: { match: strippedFirstName } }, { serviceMemberLastName: { match: strippedLastName } }] });
            filters['or'].push({ and: [{ guestFirstNames: { match: strippedFirstName } }, { guestLastNames: { match: strippedLastName } }] });
          }
          else if (textSearchLimit.indexOf('service_member') >= 0) {
            filters['and'] = [];
            filters['and'].push({ serviceMemberFirstName: { match: strippedFirstName } });
            filters['and'].push({ serviceMemberLastName: { match: strippedLastName } });
          }
          else if (textSearchLimit.indexOf('guests') >= 0) {
            filters['and'] = [];
            filters['and'].push({ guestFirstNames: { match: strippedFirstName } });
            filters['and'].push({ guestLastNames: { match: strippedLastName } });
          }
        } else {
          if (textSearchLimit.indexOf('service_member') < 0 && textSearchLimit.indexOf('guests') < 0) {
            filters['or'] = [];
            filters['or'].push({ and: [{ serviceMemberFirstName: { match: strippedFirstName } }, { serviceMemberLastName: { match: strippedLastName } }] });
            filters['or'].push({ and: [{ guestFirstNames: { match: strippedFirstName } }, { guestLastNames: { match: strippedLastName } }] });
          }
        }
      } else if (firstName.length > 0) {
        filters['or'] = [];
        const strippedFirstName = firstName.replace(/  +/g, ' ');
        if (textSearchLimit.length > 0) {
          if (textSearchLimit.indexOf('service_member') >= 0) {
            filters['or'].push({ serviceMemberFirstName: { match: strippedFirstName } });
          }
          if (textSearchLimit.indexOf('guests') >= 0) {
            filters['or'].push({ guestFirstNames: { match: strippedFirstName } });
          }
        } else {
          if (textSearchLimit.indexOf('service_member') < 0 && textSearchLimit.indexOf('guests') < 0) {
            filters['or'].push({ serviceMemberFirstName: { match: strippedFirstName } });
            filters['or'].push({ guestFirstNames: { match: strippedFirstName } });
          }
        }
      } else if (lastName.length > 0) {
        filters['or'] = [];
        const strippedLastName = lastName.replace(/  +/g, ' ');
        if (textSearchLimit.length > 0) {
          if (textSearchLimit.indexOf('service_member') >= 0) {
            filters['or'].push({ serviceMemberLastName: { match: strippedLastName } });
          }
          if (textSearchLimit.indexOf('guests') >= 0) {
            filters['or'].push({ guestLastNames: { match: strippedLastName } });
          }
        } else {
          if (textSearchLimit.indexOf('service_member') < 0 && textSearchLimit.indexOf('guests') < 0) {
            filters['or'].push({ serviceMemberLastName: { match: strippedLastName } });
            filters['or'].push({ guestLastNames: { match: strippedLastName } });
          }
        }
      }
    }

    if (confirmationNumber.length > 0) {
      filters['confirmationNumber'] = { eq: confirmationNumber }
    }

    // Service Member branch of service
    if (branchesOfServiceFilterValue) {
      filters['serviceMemberBranchOfService'] = { eq: branchesOfServiceFilterValue?.value };
    }
    // Service Member duty status
    if (dutyStatusFilterValue) {
      filters['serviceMemberDutyStatus'] = { eq: dutyStatusFilterValue?.value };
    }
    // Base/VA assigned
    if (baseVaAssignedFilterValue) {
      filters['baseAssignedID'] = {
        eq: baseVaAssignedFilterValue?.value ? baseVaAssignedFilterValue.value : '',
      };
    }
    // Treatment facility
    if (treatmentFacilityFilterValue) {
      filters['treatmentCenterID'] = {
        eq: treatmentFacilityFilterValue?.value ? treatmentFacilityFilterValue.value : '',
      };
    }

    if (isAdministrator()) {
      if (checkinDate && checkoutDate) {
        filters['checkInDates'] = {
          gte: checkinDate,
        };
        filters['checkOutDates'] = {
          lte: checkoutDate,
        };
      } else if (checkinDate) {
        filters['checkInDates'] = {
          gte: checkinDate,
        };
      } else if (checkoutDate) {
        filters['checkOutDates'] = {
          lte: checkoutDate,
        };
      }
    } else {
      if (checkinDate && checkoutDate) {
        filters['checkInDates'] = {
          gte: checkinDate,
        };
        filters['checkOutDates'] = {
          lte: checkoutDate,
        };
      } else if (checkinDate) {
        filters['checkInDates'] = {
          gte: checkinDate,
        };
      } else if (checkoutDate) {
        filters['checkOutDates'] = {
          lte: checkoutDate,
        };
      }
    }

    if (hotelChainFilterValue) {
      filters['hotelChainID'] = { eq: hotelChainFilterValue.value };
    }
    if (hotelBrandFilterValue) {
      filters['hotelBrandID'] = { eq: hotelBrandFilterValue.value };
    }
    // Affiliation
    if (affiliationFilterValue) {
      filters['not'] = {
        not: {
          not: {
            not: {
              or: [],
            },
          },
        },
      };
      if (affiliationRestrictionFilterValue.length > 0) {
        if (affiliationRestrictionFilterValue.indexOf('liaison') >= 0) {
          filters['not']['not']['not']['not']['or'].push({
            liaisonAffiliationID: { eq: affiliationFilterValue.value },
          });
        }
        if (affiliationRestrictionFilterValue.indexOf('referrer') >= 0) {
          filters['not']['not']['not']['not']['or'].push({
            referrerAffiliationID: { eq: affiliationFilterValue.value },
          });
        }
        if (affiliationRestrictionFilterValue.indexOf('admin') >= 0) {
          filters['not']['not']['not']['not']['or'].push({
            adminAffiliationID: { eq: affiliationFilterValue.value },
          });
        }
      } else {
        filters['not']['not']['not']['not']['or'].push({
          liaisonAffiliationID: { eq: affiliationFilterValue.value },
        });
        filters['not']['not']['not']['not']['or'].push({
          referrerAffiliationID: { eq: affiliationFilterValue.value },
        });
        filters['not']['not']['not']['not']['or'].push({
          adminAffiliationID: { eq: affiliationFilterValue.value },
        });
      }
    }
    if (applicationIdRestrictions.length > 0) {
      const justApplicationIds = applicationIdRestrictions.map((item) => {
        return item.noteApplicationId;
      });
      const uniqueApplicationIds = [...new Set(justApplicationIds)];
      filters['not'] = {
        not: {
          not: {
            not: {
              not: {
                not: {
                  or: uniqueApplicationIds.map((item) => {
                    return { applicationID: { eq: item } };
                  }),
                },
              },
            },
          },
        },
      };
    } else if (
      applicationIdRestrictions.length == 0 &&
      (adminActionUser ||
        adminActionAction ||
        liaisonActionUser ||
        liaisonActionAction ||
        actionStartDate ||
        actionEndDate)
    ) {
      // This means we had a note filter but there were no results that match. We need to force no results here as well.
      filters['applicationID'] = { eq: 'invalid' };
    }

    // User/Group assignments
    if (assignedLiaison) {
      filters['assignedLiaisonID'] = { eq: assignedLiaison.value };
    }
    if (assignedAdmin) {
      filters['assignedAdminID'] = { eq: assignedAdmin.value };
    }
    if (groupValue) {
      filters['groupID'] = { eq: groupValue.value };
    }

    if (isLiaison()) {
      filters['liaisonAffiliationID'] = { eq: currentProfile?.AffiliationID };
    }
    return filters;
  }, [
    assignedLiaison,
    assignedAdmin,
    groupValue,
    filterSelections,
    hotelChainFilterValue,
    hotelBrandFilterValue,
    textSearchLimit,
    searchTerm,
    firstName,
    lastName,
    confirmationNumber,
    branchesOfServiceFilterValue,
    dutyStatusFilterValue,
    affiliationFilterValue,
    affiliationRestrictionFilterValue,
    baseVaAssignedFilterValue,
    treatmentFacilityFilterValue,
    filterOptions,
    isAdministrator,
    adminActionAction,
    adminActionUser,
    liaisonActionAction,
    liaisonActionUser,
    actionStartDate,
    actionEndDate,
    readFilterValue,
    unreadFilterValue,
    modelTypeToShow,
    dateFilter,
    checkinDate,
    checkoutDate,
    getAllNotesWithGivenInput,
    isLiaison,
    currentProfile,
  ]);

  const loadApplicationResults = useCallback(
    async (limit, token) => {
      // User action
      const filters = await generateFilters();

      if (modelTypeToShow == 'stays') {
        return new Promise((resolve, reject) => {
          setIsWaiting(true);
          API.graphql(
            graphqlOperation(searchStaySearchRecords, {
              filter: filters,
              limit,
              nextToken: token,
              sort: {
                field: 'primaryCheckinDateStamp',
                direction: 'asc',
              },
            })
          ).then((results) => {
            setNextToken(results.data.searchStaySearchRecords.nextToken);
            let output = [];

            let filteredResults = results.data.searchStaySearchRecords.items;
            if (filterSelections && filterSelections.length > 0) {
              filteredResults = filteredResults.filter((item) =>
                filterSelections.includes(item.Stay?.status)
              );
            }
            if (isLiaison()) {
              filteredResults = filteredResults.filter(
                (item) =>
                  item.Application?.AssignedTo?.AffiliationID === currentProfile?.AffiliationID
              );
            }
            filteredResults.forEach((row) => {
              if (row.Application != null) {
                const status = isAdministrator()
                  ? row.Stay?.status ?? 'DRAFT'
                  : row.Stay?.status === STAYSTATUS.REVIEWED ||
                    row.Stay?.status === STAYSTATUS.CLOSED
                    ? STAYSTATUS.COMPLETED
                    : row.Stay?.status ?? 'DRAFT';
                const statusClass = classNames('status', 'status-' + status.toLowerCase());

                const service_member_name = row.Application.ServiceMember
                  ? humanName(row.Application.ServiceMember)
                  : '';
                const liaison_name = humanName(row.Application.User);
                const admin_name = humanName(row.Application.AssignedTo);
                const hotel_name = row.Stay?.HotelBooked?.name;

                const checkin = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{row.primaryCheckInDate}</a>
                  </Link>
                );
                const checkout = (
                  <Link href={'application/' + row.Application.id}>
                    <a>
                      {row.Stay?.actual_check_out
                        ? row.Stay?.actual_check_out
                        : row.Stay?.requested_check_out
                          ? row.Stay?.requested_check_out
                          : null}
                    </a>
                  </Link>
                );
                const service_member = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{service_member_name}</a>
                  </Link>
                );
                const hotel = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{hotel_name}</a>
                  </Link>
                );
                const liaison = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{liaison_name}</a>
                  </Link>
                );
                const admin = (
                  <Link href={'application/' + row.Application.id}>
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
                      {isLiaison() ? maskLiaisonStayStatus(status) : status}
                    </span>
                  ),
                  raw_status: status,
                  stay_id: row.Stay?.id,
                  stay_type: row.Stay?.type,
                  application_id: row.Application?.id,
                  actual_check_in: row.Stay?.actual_check_in,
                  actual_check_out: row.Stay?.actual_check_out,
                  raw_checkin: row.Stay?.actual_check_in
                    ? row.Stay?.actual_check_in
                    : row.Stay?.requested_check_in
                      ? row.Stay?.requested_check_in
                      : null,
                });
              }
            });

            setTotalResults(results.data.searchStaySearchRecords.total);
            setIsWaiting(false);
            resolve(output);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          setIsWaiting(true);
          API.graphql(
            graphqlOperation(searchApplicationSearchRecords, {
              filter: filters,
              limit,
              nextToken: token,
              sort: {
                field: 'primaryCheckinDateStamp',
                direction: 'asc',
              },
            })
          ).then((results) => {
            setNextToken(results.data.searchApplicationSearchRecords.nextToken);
            let output = [];
            let filteredResults = results.data.searchApplicationSearchRecords.items.filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.Application?.id === item.Application?.id)
            );
            if (filterSelections && filterSelections.length > 0) {
              filteredResults = filteredResults.filter((item) =>
                filterSelections.includes(item.Application?.status)
              );
            }
            if (isLiaison()) {
              filteredResults = filteredResults.filter(
                (item) => item.Application?.User?.AffiliationID === currentProfile?.AffiliationID
              );
            }

            filteredResults.forEach((row) => {
              if (row.Application != null) {
                // if (
                //   isLiaison() &&
                //   row.Application.User?.AffiliationID !== currentProfile?.AffiliationID
                // ) {
                //   return;
                // }
                let stay = null;
                if (row.Application.StaysInApplication.items.length > 0) {
                  stay = row.Application.StaysInApplication.items[0];
                }
                const status = isAdministrator()
                  ? row.Application.status ?? 'DRAFT'
                  : row.Application.status === STAYSTATUS.REVIEWED ||
                    row.Application.status === STAYSTATUS.CLOSED
                    ? STAYSTATUS.COMPLETED
                    : row.Application.status ?? 'DRAFT';
                const statusClass = classNames('status', 'status-' + status.toLowerCase());

                const service_member_name = row.Application.ServiceMember
                  ? humanName(row.Application.ServiceMember)
                  : '';
                const liaison_name = humanName(row.Application.User);
                const admin_name = humanName(row.Application.AssignedTo);
                const hotel_name = stay ? stay.HotelBooked?.name : '';

                const checkin = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{row.primaryCheckInDate}</a>
                  </Link>
                );
                const checkout = (
                  <Link href={'application/' + row.Application.id}>
                    <a>
                      {stay?.actual_check_out
                        ? stay?.actual_check_out
                        : stay?.requested_check_out
                          ? stay?.requested_check_out
                          : null}
                    </a>
                  </Link>
                );
                const service_member = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{service_member_name}</a>
                  </Link>
                );
                const hotel = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{hotel_name}</a>
                  </Link>
                );
                const liaison = (
                  <Link href={'application/' + row.Application.id}>
                    <a>{liaison_name}</a>
                  </Link>
                );
                const admin = (
                  <Link href={'application/' + row.Application.id}>
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
                      {isLiaison() ? maskLiaisonStayStatus(status) : status}
                    </span>
                  ),
                  raw_status: status,
                  application_id: row.Application.id,
                  initial_stay_id:
                    row.Application?.StaysInApplication?.items.length > 0
                      ? row.Application?.StaysInApplication?.items[0].id
                      : null,
                  raw_checkin: row.Stay?.actual_check_in
                    ? row.Stay?.actual_check_in
                    : row.Stay?.requested_check_in
                      ? row.Stay?.requested_check_in
                      : null,
                });
              } else {
                console.log('Skipping result set', row);
              }
            });
            setTotalResults(results.data.searchApplicationSearchRecords.total);
            setIsWaiting(false);
            resolve(output);
          });
        });
      }
    },
    [
      generateFilters,
      // filterSelections,
      isAdministrator,
      modelTypeToShow,
      setIsWaiting,
      isLiaison,
      currentProfile,
    ]
  );

  useEffect(() => {
    if (pageLimit > 0) {
      loadApplicationResults(pageLimit).then((output) => {
        setData(output);
      });
    }
  }, [
    assignedLiaison,
    assignedAdmin,
    groupValue,
    filterSelections,
    hotelChainFilterValue,
    hotelBrandFilterValue,
    pageLimit,
    loadApplicationResults,
  ]);

  const handleShowMoreClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    loadApplicationResults(pageLimit, nextToken).then((output) => {
      setData((prev) => [...prev, ...output]);
    });
  };

  const _dataMemo = useMemo(() => data, [data]);

  const updateFilterSelections = (e) => {
    var newFilterSelection = [];
    if (e.target.checked) {
      if (isLiaison() && e.target.value === APPLICATIONSTATUS.COMPLETED) {
        newFilterSelection = [
          ...filterSelections,
          e.target.value,
          APPLICATIONSTATUS.REVIEWED,
          APPLICATIONSTATUS.CLOSED,
        ];
        newFilterSelection = [...new Set(newFilterSelection)];
      } else {
        newFilterSelection = [...new Set([...filterSelections, e.target.value])];
      }
    } else {
      if (isLiaison() && e.target.value === APPLICATIONSTATUS.COMPLETED) {
        newFilterSelection = filterSelections.filter((item) => item !== e.target.value);
        newFilterSelection = newFilterSelection.filter(
          (item) => item !== APPLICATIONSTATUS.REVIEWED && item !== APPLICATIONSTATUS.CLOSED
        );
        newFilterSelection = [...new Set(newFilterSelection)];
      } else {
        newFilterSelection = [
          ...new Set(filterSelections.filter((item) => item !== e.target.value)),
        ];
      }
    }
    setFilterSelections(newFilterSelection);
  };

  const updateTextSearchLimit = (e) => {
    if (e.target.checked) {
      setTextSearchLimit([...textSearchLimit, e.target.value]);
    } else {
      setTextSearchLimit(textSearchLimit.filter((item) => item !== e.target.value));
    }
  };

  const updateAffiliationRestrictionFilterValue = (e) => {
    if (e.target.checked) {
      setAffiliationRestrictionFilterValue([...affiliationRestrictionFilterValue, e.target.value]);
    } else {
      setAffiliationRestrictionFilterValue(
        affiliationRestrictionFilterValue.filter((item) => item !== e.target.value)
      );
    }
  };

  const advancedSearchLinkClasses = classNames('advanced-link', {
    hidden: advancedSearchVisible,
  });

  const advancedSearchClasses = classNames(
    {
      liaison: isLiaison(),
    },
    {
      admin: isAdministrator(),
    },
    'advanced-search',
    {
      hidden: !advancedSearchVisible,
    }
  );

  const limitSearchOptions = [
    {
      key: 'service_member',
      value: 'Service Member',
    },
    {
      key: 'guests',
      value: 'Guests',
    }
  ];

  const columns = useMemo(
    () =>
      isSmallScreen
        ? [
          {
            Header: 'Check-in',
            accessor: 'checkin',
            className: 'checkin-col',
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
        ]
        : [
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
          {
            Header: ' ',
            className: 'actions-col',
            accessor: 'actions',
          },
        ],
    [isSmallScreen]
  );

  const initialTableState = useMemo(() => {
    return {
      sortBy: [
        {
          id: tableHeaderSort ? tableHeaderSort.key.slice(7) : 'checkin',
          desc: tableHeaderSort ? tableHeaderSort.isSorted : false,
        },
      ],
    }
  }, [tableHeaderSort]);

  const pageContainerClass = classNames('page-container', {
    admin: isAdministrator(),
    blur: shouldShowNewGroupDialog,
  });

  const dateFilterOptions = [
    {
      value: 'both',
      label: 'Both Check-in and Check-out',
    },
    {
      value: 'checkin',
      label: 'Check-in Only',
    },
    {
      value: 'checkout',
      label: 'Check-out Only',
    },
  ];

  const adminActionFilterOptions = [
    NOTEACTION.RETURN,
    NOTEACTION.DECLINE,
    NOTEACTION.APPROVE,
    NOTEACTION.APPROVE_EXTENDED_STAY,
    // NOTEACTION.COMPLETE,
    NOTEACTION.REVIEWED,
    // NOTEACTION.UNREVIEWED,
    NOTEACTION.CHANGE_ADMIN,
    NOTEACTION.ADD_NOTE,
    NOTEACTION.REGRESS,
    NOTEACTION.REGRESS_EXTENDED_STAY,
    NOTEACTION.ADD_GROUP,
    NOTEACTION.REMOVE_GROUP,
  ];

  const liaisonActionFilterOptionsForLiaisons = [
    NOTEACTION.NEW_APPLICATION,
    NOTEACTION.REQUEST_INITIAL_STAY,
    NOTEACTION.REQUEST_EXCEPTION,
    NOTEACTION.REQUEST_EXTENDED_STAY,
    NOTEACTION.COMPLETE_INITIAL_STAY,
    NOTEACTION.COMPLETE_EXTENDED_STAY,
    NOTEACTION.CHANGE_MANAGER,
    NOTEACTION.ADD_NOTE,
  ];

  const liaisonActionFilterOptions = [
    NOTEACTION.NEW_APPLICATION,
    NOTEACTION.REQUEST_INITIAL_STAY,
    NOTEACTION.REQUEST_EXCEPTION,
    NOTEACTION.REQUEST_EXTENDED_STAY,
    NOTEACTION.COMPLETE_INITIAL_STAY,
    NOTEACTION.COMPLETE_EXTENDED_STAY,
    NOTEACTION.CHANGE_MANAGER,
  ];

  const handleNewGroupClick = (e) => {
    setShouldShowNewGroupDialog(true);
  };

  const closeGroupDialog = () => {
    setShouldShowNewGroupDialog(false);
  };

  const getAffiliationTitle = () => {
    switch (affiliationTypeFilterValue) {
      case AFFILIATIONTYPE.FISHERHOUSE:
        return 'Fisher House';

      case AFFILIATIONTYPE.MEDICALCENTER:
        return 'Medical Center';

      case AFFILIATIONTYPE.BASE:
        return 'Base';

      case AFFILIATIONTYPE.ORGANIZATION:
        return 'Organization';
    }
  };

  const getAffiliationClass = () => {
    switch (affiliationTypeFilterValue) {
      case AFFILIATIONTYPE.FISHERHOUSE:
        return 'fisher-house';

      case AFFILIATIONTYPE.MEDICALCENTER:
        return 'medical-center';

      case AFFILIATIONTYPE.BASE:
        return 'base';

      case AFFILIATIONTYPE.ORGANIZATION:
        return 'organization';
    }
  };

  const getAffiliationOptions = () => {
    switch (affiliationTypeFilterValue) {
      case AFFILIATIONTYPE.FISHERHOUSE:
        return getFisherHouses;

      case AFFILIATIONTYPE.MEDICALCENTER:
        return getMedicalCenters;

      case AFFILIATIONTYPE.BASE:
        return getBases;

      case AFFILIATIONTYPE.ORGANIZATION:
        return getOrganizations;
    }
  };

  const additionalFilters = [
    <Checkboxfield
      inputOnChange={(e) => {
        setUnreadFilterValue(e.target.checked);
      }}
      label="Unread"
      inputValue="unread"
      inputChecked={unreadFilterValue}
      labelClassName="status-unread"
      key="unread-filter"
    />,
    <Checkboxfield
      inputOnChange={(e) => {
        setReadFilterValue(e.target.checked);
      }}
      label="Read"
      inputValue="read"
      inputChecked={readFilterValue}
      labelClassName="status-read"
      key="read-filter"
    />,
  ];

  const canDeleteStays = () => {
    if (_dataMemo.length == 0) {
      return false;
    }
    const uniqueStatus = [...new Set(data.map((item) => item.raw_status))];
    return uniqueStatus.length == 1;
  };

  const canDeleteApplications = () => {
    if (_dataMemo.length == 0) {
      return false;
    }
    const uniqueStatus = [...new Set(data.map((item) => item.raw_status))];
    return uniqueStatus.length == 1 && uniqueStatus[0] == APPLICATIONSTATUS.DRAFT;
  };

  const onDeleteApplicationsClick = async (e) => {
    e.preventDefault();
    if (
      confirm(
        'Are you sure you want to delete ' +
        _dataMemo.length +
        ' applications? This action cannot be undone.'
      )
    ) {
      setIsWaiting(true);
      for (const applicationToProcess of data) {
        if (applicationToProcess.initial_stay_id) {
          await API.graphql(
            graphqlOperation(deleteStay, { input: { id: applicationToProcess.initial_stay_id } })
          );
        }
        await API.graphql(
          graphqlOperation(deleteApplication, {
            input: { id: applicationToProcess.application_id },
          })
        );
      }
      loadApplicationResults(pageLimit).then((output) => {
        setData(output);
        setIsWaiting(false);
        setMessage('Applications deleted.');
      });
    }
  };

  const canExportStays = () => {
    if (_dataMemo.length == 0) {
      return false;
    }
    return true;
  };

  const onExportStaysClick = (e) => {
    e.preventDefault();
    setShouldShowExportFieldsDialog(true);
  };

  const canCloseStays = () => {
    if (_dataMemo.length == 0) {
      return false;
    }
    const uniqueStatus = [...new Set(data.map((item) => item.raw_status))];
    return uniqueStatus.length == 1 && uniqueStatus[0] == STAYSTATUS.REVIEWED;
  };

  const onCloseStaysClick = async (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to close ' + _dataMemo.length + ' stays?')) {
      // setIsWaiting(true);
      // setButtonDisabled(true);
      for (const stayToProcess of data) {
        await API.graphql(
          graphqlOperation(updateApplication, {
            input: {
              id: stayToProcess.application_id,
              status: APPLICATIONSTATUS.CLOSED,
            },
          })
        );
        await API.graphql(
          graphqlOperation(updateStay, {
            input: {
              id: stayToProcess.stay_id,
              status: STAYSTATUS.CLOSED,
            },
          })
        );
        if (stayToProcess?.stay_type == STAYTYPE.INITIAL) {
          createNote(
            humanName(profile, true) +
            ' closed the Initial Stay (' +
            (stayToProcess?.checkin?.props?.children?.props?.children
              ? format(
                makeTimezoneAwareDate(stayToProcess?.checkin?.props?.children?.props?.children),
                'MM/dd/yyyy'
              )
              : '') +
            ' - ' +
            (stayToProcess?.checkout?.props?.children?.props?.children
              ? format(
                makeTimezoneAwareDate(
                  stayToProcess?.checkout?.props?.children?.props?.children
                ),
                'MM/dd/yyyy'
              )
              : '') +
            ').',
            NOTEACTION.CLOSE,
            { id: stayToProcess.application_id },
            profile
          );
        } else {
          createNote(
            humanName(profile, true) +
            ' closed the Extended Stay (' +
            (stayToProcess?.checkin?.props?.children?.props?.children
              ? format(
                makeTimezoneAwareDate(stayToProcess?.checkin?.props?.children?.props?.children),
                'MM/dd/yyyy'
              )
              : '') +
            ' - ' +
            (stayToProcess?.checkout?.props?.children?.props?.children
              ? format(
                makeTimezoneAwareDate(
                  stayToProcess?.checkout?.props?.children?.props?.children
                ),
                'MM/dd/yyyy'
              )
              : '') +
            ').',
            NOTEACTION.CLOSE,
            { id: stayToProcess.application_id },
            profile
          );
        }
      }

      setTimeout(() => {
        setAdvancedSearchVisible(true);
        setFilterSelections([APPLICATIONSTATUS.CLOSED]);
      }, 2000);

      // loadApplicationResults(pageLimit).then((output) => {
      //   setData(output);
      //   setIsWaiting(false);
      //   setButtonDisabled(false);
      // });
    }
  };

  const onExportCheckboxSelect = (e) => {
    if (e.target.checked) {
      setSelectedExportFields((prev) => [...prev, e.target.value]);
    } else {
      setSelectedExportFields((prev) => prev.filter((item) => item != e.target.value));
    }
  };

  const onCancelExportStaysFieldSelectionClick = (e) => {
    e.preventDefault();
    setExportDialogSubmitButtonDisabled(false);
    setSelectedExportFields(defaultSelectedFields);
    setShouldShowExportFieldsDialog(false);
    setIsWaiting(false);
    setShowProgress(false);
    setPercent(0);
    setCSVData([]);
  };

  const onExportStaysDoExportClick = async (e) => {
    e.preventDefault();
    setExportDialogCloseButtonsDisabled(true);
    setExportDialogSubmitButtonDisabled(true);
    setIsWaiting(true);
    let output = [];
    // Build the header.
    let header = [];

    const sortedExportFields = selectedExportFields.sort((a, b) => {
      const aIndex = exportFieldOptions.findIndex((item) => item.key == a);
      const bIndex = exportFieldOptions.findIndex((item) => item.key == b);
      return aIndex - bIndex;
    });
    sortedExportFields.forEach((field) => {
      header.push({
        key: field,
        label: exportFieldOptions.filter((item) => item.key == field)[0].value,
      });
    });

    try {
      await API.post('Utils', '/utils/csv/export', {
        body: {
          filter: await generateFilters(),
          email: profile.username,
          fields: header,
          searchUrl: urlForSharing,
          name: humanName(profile),
        },
      });
      setMessage(
        'The export file is being generated. It will be emailed to you when it is complete. '
      );
    } catch (e) {
      setMessage('There was an error generating the export. Please try again later.');
    }

    setExportDialogSubmitButtonDisabled(false);
    setExportDialogCloseButtonsDisabled(false);
    setShouldShowExportFieldsDialog(false);
    setIsWaiting(false);
    setSelectedExportFields(defaultSelectedFields);
  };

  const onColumnHeader = (key, isSorted, ascending) => {
    setTableHeaderSort({ key, isSorted, ascending });
  };

  const exportDialogCloseButtonClass = classNames('close', {
    disabled: exportDialogCloseButtonsDisabled,
  });

  const exportDialogCancelButtonClass = classNames('cancel', {
    disabled: exportDialogCloseButtonsDisabled,
  });

  const exportDialogSubmitButtonClass = classNames('ok', {
    disabled: exportDialogSubmitButtonDisabled || selectedExportFields.length == 0,
  });

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
        {shouldShowExportFieldsDialog && (
          <div className="dialog">
            {!showProgress ? (
              <div className="dialog-box">
                <button
                  type="button"
                  className={exportDialogCloseButtonClass}
                  disabled={exportDialogCloseButtonsDisabled}
                  onClick={onCancelExportStaysFieldSelectionClick}
                >
                  Close
                </button>

                <div className="dialog-content scrollable">
                  <form>
                    <h2>Select Fields to Export</h2>
                    <fieldset className="presets">
                      <h4>Select:</h4>
                      <button
                        type="button"
                        className="select-all"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedExportFields(exportFieldOptions.map((option) => option.key));
                        }}
                      >
                        ALL
                      </button>
                      <button
                        type="button"
                        className="select-none"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedExportFields([]);
                        }}
                      >
                        NONE
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedExportFields(defaultSelectedFields);
                        }}
                      >
                        DEFAULT
                      </button>
                    </fieldset>
                    <h3>Stay Columns</h3>
                    <Checkboxes
                      withFieldset
                      options={exportFieldOptions.filter((item) => item.key.startsWith('stay|'))}
                      selected={selectedExportFields}
                      onChange={onExportCheckboxSelect}
                    />
                    <h3>Application Columns</h3>
                    <Checkboxes
                      withFieldset
                      options={exportFieldOptions.filter((item) =>
                        item.key.startsWith('application|')
                      )}
                      selected={selectedExportFields}
                      onChange={onExportCheckboxSelect}
                    />
                    <div className="dialog-controls">
                      <button
                        type="button"
                        className={exportDialogCancelButtonClass}
                        disabled={exportDialogCloseButtonsDisabled}
                        onClick={onCancelExportStaysFieldSelectionClick}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={exportDialogSubmitButtonClass}
                        disabled={
                          exportDialogSubmitButtonDisabled || selectedExportFields.length == 0
                        }
                        onClick={onExportStaysDoExportClick}
                      >
                        Export CSV
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="dialog-box">
                <button
                  type="button"
                  className={exportDialogCloseButtonClass}
                  onClick={onCancelExportStaysFieldSelectionClick}
                >
                  Close
                </button>
                <div className="dialog-content">
                  <ProgressBar
                    width={'100%'}
                    colorShift={true}
                    fillColor="orange"
                    percent={percent > 100 ? 100 : percent}
                  />
                  <div className="dialog-controls">
                    <span>{percent}%</span>
                    <button
                      type="button"
                      className="progress-cancel"
                      onClick={onCancelExportStaysFieldSelectionClick}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <CSVLink
          ref={csvDownloadLinkRef}
          key={csvDownloadCounter}
          data={CSVDATA}
          headers={CSVHeaders}
          style={{ display: 'none', visibility: 'hidden' }}
          filename={'CSV Export ' + format(new Date(), 'MM-dd-yyyy') + '.csv'}
        />
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

                  <ApplicationSearchFormElements
                    filterOptions={filterOptions}
                    onFilterChange={updateFilterSelections}
                    filterSelection={filterSelections}
                    // searchTerm={searchTerm}
                    // onSearchChange={(e) => setSearchTerm(e.target.value)}
                    firstNameValue={firstName}
                    firstNameOnChange={(e) => setFirstName(e.target.value)}
                    lastNameValue={lastName}
                    lastNameOnChange={(e) => setLastName(e.target.value)}
                    confirmationNumberValue={confirmationNumber}
                    confirmationNumberOnChange={(e) => setConfirmationNumber(e.target.value)}
                    additionalFilters={additionalFilters}
                  />

                  <a
                    className={advancedSearchLinkClasses}
                    title="More Filter Options"
                    onClick={handleAdvancedSearchClick}
                  >
                    Advanced Search
                  </a>

                  <div className={advancedSearchClasses}>
                    {isAdministrator() && (
                      <Fragment>
                        <h3>Restrict Text Search</h3>
                        <div className="advanced-filters">
                          <Checkboxes
                            options={limitSearchOptions}
                            withFieldset
                            selected={textSearchLimit}
                            onChange={updateTextSearchLimit}
                          />
                        </div>
                        <h3>Filter by Service Member or Patient Info</h3>
                        <div className="advanced-filters">
                          <Selectfield
                            label="Branch of Service"
                            wrapperClass="branch"
                            placeholder="Select Branch of Service..."
                            options={BRANCHESOFSERVICE}
                            inputValue={branchesOfServiceFilterValue}
                            inputOnChange={(e) => setBranchesOfServiceFilterValue(e)}
                            useReactSelect
                            useRegularSelect={false}
                            blankValue=""
                          />
                          <Selectfield
                            label="Duty Status"
                            wrapperClass="duty-status"
                            placeholder="Select Duty Status..."
                            options={SERVICEMEMBERSTATUS}
                            inputValue={dutyStatusFilterValue}
                            inputOnChange={(e) => setDutyStatusFilterValue(e)}
                            useReactSelect
                            useRegularSelect={false}
                            blankValue=""
                          />
                          <Selectfield
                            label={
                              dutyStatusFilterValue == SERVICEMEMBERSTATUS.VETERAN
                                ? 'VA Assigned'
                                : 'Base Assigned'
                            }
                            wrapperClass="base"
                            placeholder="Select Base Assigned..."
                            useReactSelect
                            useRegularSelect={false}
                            getOptions={
                              dutyStatusFilterValue == SERVICEMEMBERSTATUS.VETERAN
                                ? getMedicalCenters
                                : getBases
                            }
                            inputValue={baseVaAssignedFilterValue}
                            inputOnChange={(e) => setBaseVaAssignedFilterValue(e)}
                            key={dutyStatusFilterValue}
                            blankValue=""
                          />
                          <Selectfield
                            label="Treatment Facility"
                            wrapperClass="treatment-facility"
                            placeholder="Select Treatment Facility..."
                            useReactSelect
                            useRegularSelect={false}
                            getOptions={getMedicalCenters}
                            inputValue={treatmentFacilityFilterValue}
                            inputOnChange={(e) => setTreatmentFacilityFilterValue(e)}
                            blankValue=""
                          />
                        </div>
                        <h3>Filter by Stay Information</h3>
                        <div className="advanced-filters">
                          <Selectfield
                            label="Date Filter Type"
                            wrapperClass="date-filter-setting"
                            placeholder="Select Date Filter Type..."
                            inputRequired
                            options={dateFilterOptions}
                            inputValue={dateFilter}
                            inputOnChange={(e) => setDateFilter(e?.value)}
                            useReactSelect
                            useRegularSelect={false}
                            blankValue=""
                          />
                          <Datefield
                            label="Start Date"
                            wrapperClass="start-date"
                            selected={checkinDate}
                            onChange={(e) => setCheckinDate(format(makeTimezoneAwareDate(e.target.value), 'yyyy-MM-dd'))}
                          />
                          <Datefield
                            label="End Date"
                            wrapperClass="end-date"
                            selected={checkoutDate}
                            onChange={(e) => setCheckoutDate(format(makeTimezoneAwareDate(e.target.value), 'yyyy-MM-dd'))}
                          />
                          <Selectfield
                            label="Hotel Chain"
                            wrapperClass="hotel-chain"
                            placeholder="Select Hotel Chain..."
                            useReactSelect
                            useRegularSelect={false}
                            getOptions={getHotelChains}
                            inputValue={hotelChainFilterValue}
                            inputOnChange={(e) => setHotelChainFilterValue(e)}
                            blankValue=""
                          />
                          <Selectfield
                            label="Hotel Brand"
                            wrapperClass="hotel-brand"
                            placeholder="Select Hotel Brand..."
                            useReactSelect
                            useRegularSelect={false}
                            getOptions={getHotelBrands}
                            inputValue={hotelBrandFilterValue}
                            inputOnChange={(e) => setHotelBrandFilterValue(e)}
                            blankValue=""
                          />
                        </div>
                        <h3>Filter by Affiliation</h3>
                        <div className="advanced-filters">
                          <div className="input-combo affiliated">
                            <Checkboxes
                              title="Affiliated With"
                              withLabel
                              placeholder="Select..."
                              options={[
                                { key: 'liaison', value: 'Liaison', label: 'Liaison' },
                                { key: 'referrer', value: 'Referrer', label: 'Referrer' },
                                { key: 'admin', value: 'Admin', label: 'Admin' },
                              ]}
                              withFieldset
                              selected={affiliationRestrictionFilterValue}
                              onChange={updateAffiliationRestrictionFilterValue}
                            />
                          </div>
                          <Selectfield
                            label="Affiliation Type"
                            wrapperClass="affiliation-type"
                            placeholder="Select Affiliation Type..."
                            options={AFFILIATIONTYPE}
                            inputValue={affiliationTypeFilterValue}
                            inputOnChange={(e) => setAffiliationTypeFilterValue(e?.value)}
                            useReactSelect
                            useRegularSelect={false}
                            blankValue=""
                          />
                          {affiliationTypeFilterValue && (
                            <Selectfield
                              label={getAffiliationTitle()}
                              wrapperClass={getAffiliationClass()}
                              placeholder={'Select ' + getAffiliationTitle() + '...'}
                              getOptions={getAffiliationOptions()}
                              useReactSelect
                              useRegularSelect={false}
                              key={getAffiliationTitle()}
                              inputValue={affiliationFilterValue}
                              inputOnChange={(e) => setAffiliationFilterValue(e)}
                              blankValue=""
                            />
                          )}
                        </div>
                        <h3>Filter by User Action</h3>
                        <div className="advanced-filters">
                          <div className="admin-action input-combo">
                            <label>Admin Action</label>
                            <div className="dual selectbox">
                              <Selectfield
                                useReactSelect
                                useRegularSelect={false}
                                options={adminList}
                                placeholder="Select Admin..."
                                blankValue=""
                                inputValue={adminActionUser}
                                inputOnChange={(e) => setAdminActionUser(e)}
                              />
                              <Selectfield
                                useReactSelect
                                useRegularSelect={false}
                                options={[
                                  {
                                    label: 'Admin Actions',
                                    options: adminActionFilterOptions.map((item) => {
                                      return { value: item, label: mapEnumValue(item) };
                                    }),
                                  },
                                  {
                                    label: 'Liaison Actions',
                                    options: liaisonActionFilterOptions.map((item) => {
                                      return { value: item, label: mapEnumValue(item) };
                                    }),
                                  },
                                ]}
                                placeholder="Select Action..."
                                blankValue=""
                                inputValue={adminActionAction}
                                inputOnChange={(e) => setAdminActionAction(e)}
                              />
                            </div>
                          </div>
                          <div className="liaison-action input-combo">
                            <label>Liaison Action</label>
                            <div className="dual selectbox">
                              <Selectfield
                                useReactSelect
                                useRegularSelect={false}
                                options={liaisonList}
                                placeholder="Select Liaison..."
                                blankValue=""
                                inputValue={liaisonActionUser}
                                inputOnChange={(e) => setLiaisonActionUser(e)}
                              />
                              <Selectfield
                                useReactSelect
                                useRegularSelect={false}
                                options={[
                                  ...liaisonActionFilterOptions,
                                  NOTEACTION.ADD_GROUP,
                                  NOTEACTION.REMOVE_GROUP,
                                  NOTEACTION.ADD_NOTE,
                                ].map((item) => {
                                  return { value: item, label: mapEnumValue(item) };
                                })}
                                placeholder="Select Action..."
                                blankValue=""
                                inputValue={liaisonActionAction}
                                inputOnChange={(e) => setLiaisonActionAction(e)}
                              />
                            </div>
                          </div>
                          <Datefield
                            label="Start Date"
                            wrapperClass="start-date"
                            selected={actionStartDate}
                            onChange={(e) => setActionStartDate(format(makeTimezoneAwareDate(e.target.value), 'yyyy-MM-dd'))}
                          />
                          <Datefield
                            label="End Date"
                            wrapperClass="end-date"
                            selected={actionEndDate}
                            onChange={(e) => setActionEndDate(format(makeTimezoneAwareDate(e.target.value), 'yyyy-MM-dd'))}
                          />
                        </div>
                        <h3>Filter by Users and Groups</h3>
                        <div className="advanced-filters">
                          <Selectfield
                            label="Admin"
                            wrapperClass="admin"
                            placeholder="Select Admin..."
                            options={adminList}
                            useReactSelect
                            inputValue={assignedAdmin}
                            inputOnChange={(e) => setAssignedAdmin(e)}
                            blankValue=""
                          />
                          <Selectfield
                            label="Liaison"
                            wrapperClass="liaison"
                            placeholder="Select Liaison..."
                            options={liaisonList}
                            useReactSelect
                            inputValue={assignedLiaison}
                            inputOnChange={(e) => setAssignedLiaison(e)}
                            blankValue=""
                          />
                          <Selectfield
                            label="Group"
                            wrapperClass="group"
                            placeholder="Select Group..."
                            getOptions={getGroups}
                            useReactSelect
                            inputValue={groupValue}
                            inputOnChange={(e) => setGroupValue(e)}
                            blankValue=""
                          />
                        </div>
                        <p>
                          <strong>Share Search: </strong>&nbsp;
                          <a className="advanced-link" href={urlForSharing}>
                            {urlForSharing}
                          </a>
                        </p>
                      </Fragment>
                    )}
                    {isLiaison() && (
                      <Fragment>
                        <h3>Restrict Text Search</h3>
                        <div className="advanced-filters">
                          <Checkboxes
                            options={limitSearchOptions}
                            withFieldset
                            selected={textSearchLimit}
                            onChange={updateTextSearchLimit}
                          />
                        </div>
                        <h3>Filter by dates and users</h3>
                        <div className="advanced-filters">
                          <Datefield
                            label="Start Date"
                            wrapperClass="start-date"
                            selected={checkinDate}
                            onChange={(e) => setCheckinDate(e.target.value)}
                          />
                          <Datefield
                            label="End Date"
                            wrapperClass="end-date"
                            selected={checkoutDate}
                            onChange={(e) => setCheckoutDate(e.target.value)}
                          />
                          <Selectfield
                            label="Admin"
                            wrapperClass="admin"
                            placeholder="Select Admin..."
                            getOptions={getAdminsAsLiaison}
                            useReactSelect
                            inputValue={assignedAdmin}
                            inputOnChange={(e) => setAssignedAdmin(e)}
                            blankValue=""
                          />
                          <Selectfield
                            label="Liaison"
                            wrapperClass="liaison"
                            placeholder="Select Liaison..."
                            getOptions={getLiaisons}
                            useReactSelect
                            inputValue={assignedLiaison}
                            inputOnChange={(e) => setAssignedLiaison(e)}
                            blankValue=""
                          />
                        </div>

                        {/* <h3>Limit Text Search</h3>
                        <div className="limit-text-search">
                          <Checkboxes options={limitSearchOptions} />
                        </div> */}
                      </Fragment>
                    )}
                  </div>
                </form>
              </ListHeader>

              <InfiniteScroll
                dataLength={_dataMemo.length}
                next={handleShowMoreClick}
                hasMore={_dataMemo.length < totalResults}
              // loader={<h4 style={{ color: 'white' }}>Loading...</h4>}
              >
                <LiaisonTable
                  autoResetSortBy={true}
                  title={totalResults === undefined ? 'Loading...' : `${totalResults || 0} Results`}
                  tableClassName="liaison-search-results"
                  columns={columns}
                  initialTableState={initialTableState}
                  data={_dataMemo}
                  pagerText={'(' + _dataMemo.length + ' of ' + (totalResults || 0) + ')'}
                  showPager={false}
                  onPagerTrigger={handleShowMoreClick}
                  resetSearch={resetSearch}
                  isResetSearch={true}
                  onColumnHeader={onColumnHeader}
                  showLoader={totalResults === undefined ? true : false}
                >
                  {isAdministrator() && (
                    <div className="admin table-controls-panel">
                      <div className="buttons">
                        {canDeleteApplications() && modelTypeToShow == 'applications' && (
                          <button
                            type="button"
                            className="delete"
                            onClick={onDeleteApplicationsClick}
                            disabled={buttonDisabled}
                          >
                            Delete
                          </button>
                        )}
                        {canExportStays() && modelTypeToShow == 'stays' && (
                          <button
                            type="button"
                            onClick={onExportStaysClick}
                            disabled={buttonDisabled}
                          >
                            Export CSV
                          </button>
                        )}
                        {canCloseStays() && modelTypeToShow == 'stays' && (
                          <button
                            type="button"
                            onClick={onCloseStaysClick}
                            disabled={buttonDisabled}
                          >
                            Close Stays ({_dataMemo.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </LiaisonTable>
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
