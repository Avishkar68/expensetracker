import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import Toast from './components/Toast';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';
import {
  getExpenses,
  createExpense,
  updateExpenseStatus,
} from './services/api';
import { Plus } from 'lucide-react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    pendingAmount: 0,
    settledAmount: 0,
    totalCount: 0,
    pendingCount: 0,
    settledCount: 0,
  });

  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'done'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Show a notification toast
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Fetch all expenses from backend
  const fetchAllExpenses = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      const res = await getExpenses({ status: 'all', search: '' });
      if (res.success) {
        setExpenses(res.data);
        if (res.summary) {
          setSummary(res.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
      showToast(err.message || 'Could not load expenses', 'error');
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAllExpenses(true);
  }, [fetchAllExpenses]);

  // Add new expense
  const handleAddExpense = async ({ amount, reason, paidBy }) => {
    const res = await createExpense({ amount, reason, paidBy });
    if (res.success) {
      // Prepend to expenses list
      setExpenses((prev) => [res.data, ...prev]);
      if (res.summary) {
        setSummary(res.summary);
      }
      showToast('Expense added successfully', 'success');
    }
  };

  // Mark done / pending
  const handleToggleStatus = async (id, targetStatus) => {
    try {
      setUpdatingId(id);

      // Optimistic update
      setExpenses((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, status: targetStatus, updatedAt: new Date().toISOString() }
            : item
        )
      );

      const res = await updateExpenseStatus(id, targetStatus);
      if (res.success) {
        // Sync with exact server document & summary
        setExpenses((prev) =>
          prev.map((item) => (item._id === id ? res.data : item))
        );
        if (res.summary) {
          setSummary(res.summary);
        }
        showToast(
          targetStatus === 'done' ? 'Expense marked as Done' : 'Expense marked as Pending',
          'success'
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
      showToast(err.message || 'Failed to update status', 'error');
      // Rollback on error
      fetchAllExpenses(false);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter & search calculations
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Status filter
      if (filter !== 'all' && item.status !== filter) {
        return false;
      }
      // Search query (matches person or reason)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPerson = (item.paidBy || '').toLowerCase().includes(query);
        const matchesReason = (item.reason || '').toLowerCase().includes(query);
        return matchesPerson || matchesReason;
      }
      return true;
    });
  }, [expenses, filter, searchQuery]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const total = expenses.length;
    const pending = expenses.filter((e) => e.status === 'pending').length;
    const done = expenses.filter((e) => e.status === 'done').length;
    return { total, pending, done };
  }, [expenses]);

  // Dynamic summary if expenses array changed locally
  const dynamicSummary = useMemo(() => {
    const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const pendingAmount = expenses
      .filter((e) => e.status === 'pending')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const settledAmount = expenses
      .filter((e) => e.status === 'done')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    return {
      totalExpenses,
      pendingAmount,
      settledAmount,
      totalCount: tabCounts.total,
      pendingCount: tabCounts.pending,
      settledCount: tabCounts.done,
    };
  }, [expenses, tabCounts]);

  const handleScrollToExpenses = () => {
    const el = document.getElementById('expenses-controls');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-container">
      {/* 1. Header with main actions */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onViewExpenses={handleScrollToExpenses}
      />

      {/* 2. Small Summary Cards (Calculated automatically from MongoDB data) */}
      <SummaryCards summary={dynamicSummary} />

      {/* 3. Filters & Search */}
      <FilterBar
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={tabCounts}
      />

      {/* 4. Expenses List / Empty State / Loading */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState
          isFiltered={filter !== 'all' || Boolean(searchQuery.trim())}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onClearFilters={() => {
            setFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <ExpenseList
          expenses={filteredExpenses}
          onToggleStatus={handleToggleStatus}
          updatingId={updatingId}
        />
      )}

      {/* 5. Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExpense={handleAddExpense}
      />

      {/* 6. Mobile Floating Action Button */}
      <button
        className="mobile-fab"
        onClick={() => setIsAddModalOpen(true)}
        title="Add Expense"
        aria-label="Add new expense"
      >
        <Plus size={26} strokeWidth={2.6} />
      </button>

      {/* 7. Toast notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
