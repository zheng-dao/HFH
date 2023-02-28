import classNames from 'classnames';
import { useTable, useSortBy } from 'react-table';
import VisibilitySensor from 'react-visibility-sensor';

export default function Table(props) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: props.columns,
      data: props.data,
      initialState: {
        ...props.initialTableState,
      },
      autoResetSortBy: props.autoResetSortBy || false
      // disableSortRemove: true,
    },
    useSortBy,
  );

  return (
    <table {...getTableProps()} className={props.tableClassName}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map((column) => {
                const { key, ...restColumn } = column.getHeaderProps({
                  ...column.getSortByToggleProps(),
                  className: column.render('className'),
                });
                const spanClasses = classNames({
                  selected: column.isSorted,
                  ascending: !column.isSortedDesc,
                });
                return (
                  <th key={key} {...restColumn}>
                    {column.render('Header') != ' ' && (
                      <span className={spanClasses} onClick={e => props.onColumnHeader(key, column.isSorted, !column.isSortedDesc)}>{column.render('Header')}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <VisibilitySensor
        onChange={props.toggleVisibility}
        partialVisibility
        offset={{ top: 100 }}
        delayedCall
      >
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr key={key} {...restRowProps}>
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td {...restCellProps} key={key}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {props.showPager && (
            <tr className="more">
              <td colSpan={1000}>
                <a className="showmore" href="#" title="Show More" onClick={props.onPagerTrigger}>
                  {props.pagerText}
                  &nbsp;<strong>Show More</strong>
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </VisibilitySensor>
    </table>
  );
}

Table.defaultProps = {
  autoResetSortBy: false,
  columns: [],
  data: [],
  tableClassName: '',
  initialTableState: {},
  showPager: true,
  onPagerTrigger: () => {},
  pagerText: '',
  toggleVisibility: () => {},
  onColumnHeader: () => {},
};
