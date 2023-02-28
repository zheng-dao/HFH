import { Fragment } from 'react';
import SearchFormElements from '@components/SearchFormElements';

export default function SearchForm(props) {
  return (
    <Fragment>
      <header className="list-header">
        <form className="main-search">
          <h2>
            {props.title}
            {props.includeAddNewButton && (
              <button
                type='button'
                className="add new"
                onClick={props.addNewClick}
                disabled={props.addNewButtonDisabled}
              >
                Add New
              </button>
            )}
          </h2>

          <SearchFormElements
            searchTerm={props.searchTerm}
            onSearchChange={props.onSearchChange}
            onSearch={props.onSearch}
            filterOptions={props.filterOptions}
            onFilterChange={props.onFilterChange}
            filterSelection={props.filterSelection}
            additionalFilters={props.additionalFilters}
          />
        </form>
      </header>
    </Fragment>
  );
}

SearchForm.defaultProps = {
  title: '',
  addNewClick: () => {},
  filterOptions: [],
  filterSelection: [],
  onFilterChange: () => {},
  searchTerm: '',
  onSearchChange: () => {},
  onSearch: (e) => {
    e.preventDefault();
  },
  additionalFilters: [],
  includeAddNewButton: true,
  addNewButtonDisabled: false,
};
