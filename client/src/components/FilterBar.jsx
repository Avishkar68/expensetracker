import React from 'react';
import { Search, X } from 'lucide-react';

export default function FilterBar({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}) {
  return (
    <div className="controls-bar" id="expenses-controls">
      {/* Simple Filter Tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Expense status filters">
        <button
          id="filter-tab-all"
          role="tab"
          aria-selected={currentFilter === 'all'}
          className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          <span>All</span>
          <span className="filter-badge">{counts.total}</span>
        </button>

        <button
          id="filter-tab-pending"
          role="tab"
          aria-selected={currentFilter === 'pending'}
          className={`filter-tab ${currentFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          <span>Pending</span>
          <span className="filter-badge">{counts.pending}</span>
        </button>

        <button
          id="filter-tab-done"
          role="tab"
          aria-selected={currentFilter === 'done'}
          className={`filter-tab ${currentFilter === 'done' ? 'active' : ''}`}
          onClick={() => onFilterChange('done')}
        >
          <span>Done</span>
          <span className="filter-badge">{counts.done}</span>
        </button>
      </div>

      {/* Simple Search Field */}
      <div className="search-box">
        <Search className="search-icon" size={16} />
        <input
          id="search-expenses-input"
          type="text"
          className="search-input"
          placeholder="Search by person or reason..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search expenses by person or reason"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search"
            aria-label="Clear search query"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
