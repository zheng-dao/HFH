import { Fragment, useEffect, useMemo, useState } from 'react';
import SystemLandingBlock from '../SystemLandingBlock';
import SidebarMenu from '../SidebarMenu';
import { DataStore } from 'aws-amplify';
import { HotelChain, HotelBrand, HotelProperty, Affiliation } from '@src/models';
import {
  HOTELCHAINSTATUS,
  HOTELBRANDSTATUS,
  HOTELPROPERTYSTATUS,
  AFFILIATIONSTATUS,
  AFFILIATIONTYPE,
} from '@src/API';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  listHotelChains,
  searchHotelChains,
  listHotelBrands,
  searchHotelBrands,
  listHotelProperties,
  searchHotelProperties,
  listAffiliations,
  searchAffiliations,
} from '@src/graphql/queries';

export default function SystemMenu(props) {
  const [hotelChainsPending, setHotelChainsPending] = useState(0);
  const [hotelBrandsPending, setHotelBrandsPending] = useState(0);
  const [hotelPropertiesPending, setHotelPropertiesPending] = useState(0);
  const [medicalCentersPending, setMedicalCentersPending] = useState(0);
  const [militaryBasesPending, setMilitaryBasesPending] = useState(0);
  const [fisherHousesPending, setFisherHousesPending] = useState(0);
  const [organizationsPending, setOrganizationsPending] = useState(0);

  // Giant section to load counts for each section.
  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelChain, (c) => c.status('eq', HOTELCHAINSTATUS.PENDING), {
        limit: 99,
      }).then((results) => setHotelChainsPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchHotelChains, {
          filter: { status: { eq: HOTELCHAINSTATUS.PENDING } },
        })
      ).then((results) => setHotelChainsPending(results.data.searchHotelChains.total));
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelBrand, (b) => b.status('eq', HOTELBRANDSTATUS.PENDING), {
        limit: 99,
      }).then((results) => setHotelBrandsPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchHotelBrands, {
          filter: { status: { eq: HOTELBRANDSTATUS.PENDING } },
        })
      ).then((results) => setHotelBrandsPending(results.data.searchHotelBrands.total));
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelProperty, (p) => p.status('eq', HOTELPROPERTYSTATUS.PENDING), {
        limit: 99,
      }).then((results) => setHotelPropertiesPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchHotelProperties, {
          filter: { status: { eq: HOTELPROPERTYSTATUS.PENDING } },
        })
      ).then((results) => setHotelPropertiesPending(results.data.searchHotelProperties.total));
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Affiliation,
        (a) => a.status('eq', AFFILIATIONSTATUS.PENDING).type('eq', AFFILIATIONTYPE.MEDICALCENTER),
        {
          limit: 99,
        }
      ).then((results) => setMedicalCentersPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchAffiliations, {
          filter: {
            status: { eq: AFFILIATIONSTATUS.PENDING },
            type: { eq: AFFILIATIONTYPE.MEDICALCENTER },
          },
        })
      ).then((results) => setMedicalCentersPending(results.data.searchAffiliations.total));
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Affiliation,
        (a) => a.status('eq', AFFILIATIONSTATUS.PENDING).type('eq', AFFILIATIONTYPE.BASE),
        {
          limit: 99,
        }
      ).then((results) => setMilitaryBasesPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchAffiliations, {
          filter: { status: { eq: AFFILIATIONSTATUS.PENDING }, type: { eq: AFFILIATIONTYPE.BASE } },
        })
      ).then((results) => setMilitaryBasesPending(results.data.searchAffiliations.total));
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Affiliation,
        (a) => a.status('eq', AFFILIATIONSTATUS.PENDING).type('eq', AFFILIATIONTYPE.FISHERHOUSE),
        {
          limit: 99,
        }
      ).then((results) => setFisherHousesPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchAffiliations, {
          filter: {
            status: { eq: AFFILIATIONSTATUS.PENDING },
            type: { eq: AFFILIATIONTYPE.FISHERHOUSE },
          },
        })
      ).then((results) => setFisherHousesPending(results.data.searchAffiliations.total));
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        Affiliation,
        (a) => a.status('eq', AFFILIATIONSTATUS.PENDING).type('eq', AFFILIATIONTYPE.ORGANIZATION),
        {
          limit: 99,
        }
      ).then((results) => setOrganizationsPending(results.length));
    } else {
      API.graphql(
        graphqlOperation(searchAffiliations, {
          filter: {
            status: { eq: AFFILIATIONSTATUS.PENDING },
            type: { eq: AFFILIATIONTYPE.ORGANIZATION },
          },
        })
      ).then((results) => setOrganizationsPending(results.data.searchAffiliations.total));
    }
  }, []);

  // Memo-ize the menu content value
  const _menuContent = useMemo(() => {
    return {
      entities: {
        title: 'Entities',
        class: 'entities',
        children: [
          {
            title: 'Hotel Chains',
            badge: hotelChainsPending,
            link: '/system/entities/hotel-chains',
          },
          {
            title: 'Hotel Brands',
            badge: hotelBrandsPending,
            link: '/system/entities/hotel-brands',
          },
          {
            title: 'Hotel Properties',
            badge: hotelPropertiesPending,
            link: '/system/entities/hotel-properties',
          },
          {
            title: 'Medical Centers',
            badge: medicalCentersPending,
            link: '/system/entities/medical-centers',
          },
          {
            title: 'Military Bases',
            badge: militaryBasesPending,
            link: '/system/entities/military-bases',
          },
          {
            title: 'Fisher Houses',
            badge: fisherHousesPending,
            link: '/system/entities/fisher-houses',
          },
          {
            title: 'Organizations',
            badge: organizationsPending,
            link: '/system/entities/organizations',
          },
          {
            title: 'Payment Types',
            badge: 0,
            link: '/system/entities/payment-types',
          },
          {
            title: 'Credit Cards',
            badge: 0,
            link: '/system/entities/credit-cards',
          },
          {
            title: 'Groups',
            badge: 0,
            link: '/system/entities/groups',
          },
        ],
      },
      system: {
        title: 'System Preferences',
        children: [
          {
            title: 'User Instructions Management',
            badge: 0,
            link: '/system/instructions',
          },
          {
            title: 'Settings',
            badge: 0,
            link: '/system/settings',
          },
        ],
      },
    };
  }, [
    hotelChainsPending,
    hotelBrandsPending,
    hotelPropertiesPending,
    medicalCentersPending,
    militaryBasesPending,
    fisherHousesPending,
    organizationsPending,
  ]);

  if (props.sidebar) {
    return (
      <div className="sidebar">
        <div className="system-menu app-pane">
          <SidebarMenu menu={Object.values(_menuContent)} />
        </div>
      </div>
    );
  } else if (props.block) {
    return (
      <Fragment>
        {Object.values(_menuContent).map((item, index) => (
          <SystemLandingBlock
            key={index}
            title={item.title}
            wrapperClass={item.class}
            menu={item.children}
          />
        ))}
      </Fragment>
    );
  } else {
    return null;
  }
}

SystemMenu.defaultProps = {
  block: false,
  sidebar: false,
};
