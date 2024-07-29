import React from 'react';
import '../styles/Filters.css'; // Import the Filters CSS

const Filters = ({ filters, selectedFilters, handleFilterChange, toggleFilterCategory, expandedFilters }) => {
  const safeFilters = filters || [];

  return (
    <div className="filters">
      {safeFilters.map((filterCategory) => (
        <div
          key={filterCategory.name}
          className={`filter-category ${expandedFilters[filterCategory.name] ? 'expanded' : ''}`}
        >
          <div className="filter-header" onClick={() => toggleFilterCategory(filterCategory.name)}>
            <h4>{filterCategory.name}</h4>
          </div>
          <div className={`filter-body ${expandedFilters[filterCategory.name] ? 'show' : ''}`}>
            {filterCategory.filters.map((filter) => (
              <div key={filter} className="filter-option">
                <input
                  type="checkbox"
                  id={filter}
                  checked={selectedFilters[filterCategory.name]?.includes(filter) || false}
                  onChange={() => handleFilterChange(filterCategory.name, filter)}
                />
                <label htmlFor={filter}>
                  {filter}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filters;
