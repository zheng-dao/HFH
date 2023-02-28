import { useTable } from 'react-table';
import Table from '@components/Table';

export default function SystemEntityTable(props) {
  return (
    <div className="system-table admin-table">
      <h3 className="disclose">{props.title}</h3>

      <Table
        autoResetSortBy={props.autoResetSortBy}
        columns={props.columns}
        tableClassName={props.tableClassName}
        initialTableState={props.initialTableState}
        data={props.data}
        showPager={props.showPager}
        onPagerTrigger={props.onPagerTrigger}
        pagerText={props.pagerText}
      />
      <div className="list-end table-controls" style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        {
          props.showLoader && <h3 style={{ padding: 0, margin: 0 }}>Loading...</h3>
        }
      </div>
    </div>
  );
}

SystemEntityTable.defaultProps = {
  autoResetSortBy: false,
  title: '',
  columns: [],
  tableClassName: '',
  initialTableState: {},
  data: [],
  showPager: true,
  onPagerTrigger: () => { },
  pagerText: '',
  showLoader: false
};
