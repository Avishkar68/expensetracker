import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, PlusCircle, Sparkles } from 'lucide-react';

const COMMON_TEAM_MEMBERS = ['Avishkar', 'Nitin', 'Swapnil'];
const COMMON_REASONS = [
  'Auto to VIT',
  'Printing banners',
  'Lunch during college visit',
  'Cab travel',
  'Event stationery',
];

export default function AddExpenseModal({ isOpen, onClose, onAddExpense }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const amountInputRef = useRef(null);

  // Autofocus when modal opens & reset state
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setReason('');
      setPaidBy('');
      setFormError('');
      setIsSubmitting(false);

      const timer = setTimeout(() => {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (!reason.trim()) {
      setFormError('Please enter a reason for the expense');
      return;
    }

    if (!paidBy.trim()) {
      setFormError('Please specify who paid for this expense');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddExpense({
        amount: numericAmount,
        reason: reason.trim(),
        paidBy: paidBy.trim(),
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to add expense. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title" id="modal-title">
            <PlusCircle size={20} className="text-primary" />
            <span>Add New Expense</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {formError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                {formError}
              </div>
            )}

            {/* 1. Amount */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">
                <span>
                  Amount <span className="required-mark">*</span>
                </span>
              </label>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input
                  ref={amountInputRef}
                  id="expense-amount"
                  type="number"
                  step="any"
                  min="1"
                  className="form-input has-prefix"
                  placeholder="350"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 2. Reason */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-reason">
                <span>
                  Reason <span className="required-mark">*</span>
                </span>
              </label>
              <input
                id="expense-reason"
                type="text"
                className="form-input"
                placeholder="e.g. Auto to VIT, Printing banners, Lunch"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                disabled={isSubmitting}
              />
              {/* Quick suggestions */}
              <div className="chips-row">
                {COMMON_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`chip-btn ${reason === r ? 'active' : ''}`}
                    onClick={() => setReason(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Paid By */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-paidby">
                <span>
                  Paid By <span className="required-mark">*</span>
                </span>
              </label>
              <input
                id="expense-paidby"
                type="text"
                className="form-input"
                placeholder="e.g. Swapnil, Avishkar, Nitin"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                required
                disabled={isSubmitting}
              />
              {/* Quick Member chips */}
              <div className="chips-row">
                {COMMON_TEAM_MEMBERS.map((member) => (
                  <button
                    key={member}
                    type="button"
                    className={`chip-btn ${paidBy.toLowerCase() === member.toLowerCase() ? 'active' : ''}`}
                    onClick={() => setPaidBy(member)}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-generated Timestamp Notice */}
            <div className="auto-notice">
              <Clock size={16} className="auto-notice-icon" />
              <span>Date & time will be generated automatically upon submission.</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="btn-submit-expense"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
