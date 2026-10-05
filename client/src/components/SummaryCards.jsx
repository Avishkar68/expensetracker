import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Wallet, Clock, CheckCircle2 } from 'lucide-react';

export default function SummaryCards({ summary }) {
  const {
    totalExpenses = 0,
    pendingAmount = 0,
    settledAmount = 0,
    totalCount = 0,
    pendingCount = 0,
    settledCount = 0,
  } = summary || {};

  return (
    <section className="summary-grid" aria-label="Expenses Financial Summary">
      {/* Total Expenses Card */}
      <div className="summary-card total" id="summary-total">
        <div className="summary-info">
          <span className="summary-label">Total Expenses</span>
          <span className="summary-amount">{formatCurrency(totalExpenses)}</span>
          <span className="summary-meta">
            {totalCount} {totalCount === 1 ? 'expense' : 'expenses'} recorded
          </span>
        </div>
        <div className="summary-icon-badge" aria-hidden="true">
          <Wallet size={20} strokeWidth={2.2} />
        </div>
      </div>

      {/* Pending to Pay Card */}
      <div className="summary-card pending" id="summary-pending">
        <div className="summary-info">
          <span className="summary-label">Pending to Pay</span>
          <span className="summary-amount">{formatCurrency(pendingAmount)}</span>
          <span className="summary-meta">
            {pendingCount} {pendingCount === 1 ? 'expense' : 'expenses'} pending
          </span>
        </div>
        <div className="summary-icon-badge" aria-hidden="true">
          <Clock size={20} strokeWidth={2.2} />
        </div>
      </div>

      {/* Paid / Settled Card */}
      <div className="summary-card settled" id="summary-settled">
        <div className="summary-info">
          <span className="summary-label">Paid / Settled</span>
          <span className="summary-amount">{formatCurrency(settledAmount)}</span>
          <span className="summary-meta">
            {settledCount} {settledCount === 1 ? 'expense' : 'expenses'} cleared
          </span>
        </div>
        <div className="summary-icon-badge" aria-hidden="true">
          <CheckCircle2 size={20} strokeWidth={2.2} />
        </div>
      </div>
    </section>
  );
}
