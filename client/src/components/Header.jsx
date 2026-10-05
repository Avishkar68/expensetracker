import React from 'react';
import { Plus, ListFilter, IndianRupee } from 'lucide-react';

export default function Header({ onOpenAddModal, onViewExpenses }) {
  return (
    <header className="header-wrapper">
      <div className="brand-section">
        <div className="brand-icon" aria-hidden="true">
          <IndianRupee size={24} strokeWidth={2.6} />
        </div>
        <div className="brand-text">
          <h1>Marketing Expenses</h1>
          <p>Internal Team Reimbursement Tracker</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          id="btn-add-expense"
          className="btn-primary"
          onClick={onOpenAddModal}
          title="Record a new marketing expense"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>+ Add Expense</span>
        </button>

        <button
          id="btn-view-expenses"
          className="btn-secondary"
          onClick={onViewExpenses}
          title="Scroll to expenses list"
        >
          <ListFilter size={17} strokeWidth={2} />
          <span>View Expenses</span>
        </button>
      </div>
    </header>
  );
}
