import Table from '@components/Table';
import useAuth from '@contexts/AuthContext';
import classNames from 'classnames';
import { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export default function LiaisonTable(props) {
  const { isAdministrator } = useAuth();

  const [isTableSticky, setIsTableSticky] = useState(false);

  const toggleVisibility = (isVisible) => {
    setIsTableSticky(isVisible);
  };

  const fixedListClass = classNames({
    'fixed-list-end': isTableSticky,
  });

  return (
    <div className="liaison-table">
      <h3 className="disclose">
        {props.title}{' '}
        {props.isResetSearch && <button onClick={props.resetSearch}>Reset Search</button>}
      </h3>

      <Table
        autoResetSortBy={props.autoResetSortBy}
        columns={props.columns}
        tableClassName={props.tableClassName}
        initialTableState={props.initialTableState}
        data={props.data}
        showPager={props.showPager}
        onPagerTrigger={props.onPagerTrigger}
        pagerText={props.pagerText}
        toggleVisibility={toggleVisibility}
        onColumnHeader={props.onColumnHeader}
      />

      {/* <div className={fixedListClass}> */}
        <div className="list-end table-controls">
          {
            props.children ? !props.showLoader ? props.children :
              <div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ padding: 0, margin: 0 }}>Loading...</h3>
                </div>
                {props.children}
              </div>
              :
              !props.showLoader ?
                <div>&nbsp;</div>
                :
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ padding: 0, margin: 0 }}>Loading...</h3>
                </div>
          }
        </div>
      {/* </div> */}
    </div>
  );
}

LiaisonTable.defaultProps = {
  autoResetSortBy: false,
  columns: [],
  data: [],
  title: '',
  tableClassName: '',
  initialTableState: {},
  showPager: true,
  onPagerTrigger: () => { },
  pagerText: '',
  onColumnHeader: () => { },
  showLoader: false
};
