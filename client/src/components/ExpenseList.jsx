import React from 'react';
import {
  formatCurrency,
  formatDateTime,
  formatShortDateTime,
  getAvatarColor,
  getInitials,
} from '../utils/formatters';
import { Check, CheckCircle2, Clock, RotateCcw } from 'lucide-react';

export default function ExpenseList({
  expenses,
  onToggleStatus,
  updatingId,
}) {
  return (
    <div className="expenses-container" id="expenses-list-container">
      {/* 1. DESKTOP VIEW: Clean Table */}
      <div className="table-responsive">
        <table className="expense-table" aria-label="Marketing team expenses list">
          <thead>
            <tr>
              <th>Person</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const isDone = expense.status === 'done';
              const isUpdating = updatingId === expense._id;

              return (
                <tr
                  key={expense._id}
                  className={`expense-row ${isDone ? 'is-done' : 'is-pending'}`}
                  id={`expense-row-${expense._id}`}
                >
                  {/* Person */}
                  <td className="person-cell">
                    <div
                      className="person-avatar"
                      style={{ backgroundColor: getAvatarColor(expense.paidBy) }}
                      title={`Paid by ${expense.paidBy}`}
                    >
                      {getInitials(expense.paidBy)}
                    </div>
                    <span className="person-name">{expense.paidBy}</span>
                  </td>

                  {/* Amount */}
                  <td className="amount-cell">
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Reason */}
                  <td className="reason-cell">
                    {expense.reason}
                  </td>

                  {/* Date & Time */}
                  <td className="datetime-cell">
                    {formatDateTime(expense.createdAt)}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-badge ${expense.status}`}>
                      <span className="status-dot"></span>
                      {expense.status === 'done' ? 'Done' : 'Pending'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ textAlign: 'right' }}>
                    {isDone ? (
                      <button
                        className="btn-action-settled"
                        onClick={() => onToggleStatus(expense._id, 'pending')}
                        title="Click to mark as pending if needed"
                        disabled={isUpdating}
                      >
                        <Check size={16} strokeWidth={2.5} />
                        <span>Done</span>
                      </button>
                    ) : (
                      <button
                        className="btn-action-done"
                        onClick={() => onToggleStatus(expense._id, 'done')}
                        title="Mark this expense as reimbursed/settled"
                        disabled={isUpdating}
                        id={`btn-mark-done-${expense._id}`}
                      >
                        <CheckCircle2 size={15} />
                        <span>{isUpdating ? 'Saving...' : 'Mark Done'}</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE VIEW: Touch-Friendly Card List */}
      <div className="mobile-card-list">
        {expenses.map((expense) => {
          const isDone = expense.status === 'done';
          const isUpdating = updatingId === expense._id;

          return (
            <div
              key={expense._id}
              className={`mobile-expense-card ${isDone ? 'is-done' : 'is-pending'}`}
              id={`mobile-card-${expense._id}`}
            >
              {/* Header: Person & Status */}
              <div className="mobile-card-header">
                <div className="person-cell">
                  <div
                    className="person-avatar"
                    style={{ backgroundColor: getAvatarColor(expense.paidBy) }}
                  >
                    {getInitials(expense.paidBy)}
                  </div>
                  <div>
                    <div className="person-name">{expense.paidBy}</div>
                    <div className="datetime-cell" style={{ fontSize: '0.75rem' }}>
                      {formatShortDateTime(expense.createdAt)}
                    </div>
                  </div>
                </div>

                <span className={`status-badge ${expense.status}`}>
                  <span className="status-dot"></span>
                  {isDone ? 'Done' : 'Pending'}
                </span>
              </div>

              {/* Body: Reason */}
              <div className="mobile-card-body">
                <div className="mobile-card-reason">{expense.reason}</div>
              </div>

              {/* Footer: Amount & Action */}
              <div className="mobile-card-footer">
                <div className="mobile-card-amount">
                  {formatCurrency(expense.amount)}
                </div>

                {isDone ? (
                  <button
                    className="btn-action-settled"
                    onClick={() => onToggleStatus(expense._id, 'pending')}
                    title="Click to mark pending"
                    disabled={isUpdating}
                  >
                    <Check size={16} strokeWidth={2.5} />
                    <span>Reimbursed</span>
                  </button>
                ) : (
                  <button
                    className="btn-action-done"
                    onClick={() => onToggleStatus(expense._id, 'done')}
                    disabled={isUpdating}
                  >
                    <CheckCircle2 size={15} />
                    <span>{isUpdating ? 'Saving...' : 'Mark Done'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
