import React from 'react';
import { Receipt, SearchX, Plus } from 'lucide-react';

export default function EmptyState({
  isFiltered,
  onOpenAddModal,
  onClearFilters,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {isFiltered ? <SearchX size={26} /> : <Receipt size={26} />}
      </div>
      <h3 className="empty-title">
        {isFiltered ? 'No matching expenses found' : 'No expenses recorded yet'}
      </h3>
      <p className="empty-desc">
        {isFiltered
          ? 'Try clearing your search or switching filter tabs to see all expenses.'
          : 'Keep track of college visits, travel, printing, and food expenses in seconds.'}
      </p>

      {isFiltered ? (
        <button
          className="btn-secondary"
          onClick={onClearFilters}
          style={{ marginTop: '0.5rem' }}
        >
          Reset Filters
        </button>
      ) : (
        <button
          className="btn-primary"
          onClick={onOpenAddModal}
          style={{ marginTop: '0.5rem' }}
        >
          <Plus size={16} />
          <span>Add First Expense</span>
        </button>
      )}
    </div>
  );
}
