import Expense from '../models/Expense.js';

/**
 * Helper function to calculate aggregate summary from the database
 */
const calculateSummary = async () => {
  const stats = await Expense.aggregate([
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$amount' },
        pendingAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
          },
        },
        settledAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'done'] }, '$amount', 0],
          },
        },
        totalCount: { $sum: 1 },
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
          },
        },
        settledCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (stats.length > 0) {
    const { _id, ...summary } = stats[0];
    return summary;
  }

  return {
    totalExpenses: 0,
    pendingAmount: 0,
    settledAmount: 0,
    totalCount: 0,
    pendingCount: 0,
    settledCount: 0,
  };
};

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses with optional filtering and search, plus global summary
 */
export const getExpenses = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    // Filter by status if provided (pending or done)
    if (status && status !== 'all') {
      filter.status = status.toLowerCase();
    }

    // Filter by search term (matches paidBy or reason case-insensitively)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ paidBy: searchRegex }, { reason: searchRegex }];
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 }).lean();
    const summary = await calculateSummary();

    res.status(200).json({
      success: true,
      count: expenses.length,
      summary,
      data: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 */
export const createExpense = async (req, res) => {
  try {
    const { amount, reason, paidBy } = req.body;

    // Field validations
    if (amount === undefined || amount === null || amount === '') {
      return res.status(400).json({
        success: false,
        message: 'Amount is required',
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid amount greater than ₹0',
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required (e.g., "Auto to VIT", "Printing banners")',
      });
    }

    if (!paidBy || !paidBy.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please specify who paid this expense',
      });
    }

    // Automatic server timestamp and initial status 'pending'
    const newExpense = await Expense.create({
      amount: Math.round(numericAmount * 100) / 100, // standard 2 decimals max
      reason: reason.trim(),
      paidBy: paidBy.trim(),
      status: 'pending',
    });

    const summary = await calculateSummary();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense,
      summary,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create expense',
    });
  }
};

/**
 * @route   PATCH /api/expenses/:id/status
 * @desc    Update status of an expense (done or pending)
 */
export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // If status is explicitly passed, validate and use it; otherwise toggle
    let newStatus = status;
    if (!newStatus) {
      newStatus = expense.status === 'pending' ? 'done' : 'pending';
    } else if (!['pending', 'done'].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be either "pending" or "done"',
      });
    }

    expense.status = newStatus;
    // Saving automatically triggers updatedAt update
    await expense.save();

    const summary = await calculateSummary();

    res.status(200).json({
      success: true,
      message: `Expense marked as ${newStatus === 'done' ? 'Done' : 'Pending'}`,
      data: expense,
      summary,
    });
  } catch (error) {
    console.error('Error updating expense status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense status',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/expenses/summary
 * @desc    Get aggregate summary of expenses
 */
export const getExpenseSummary = async (req, res) => {
  try {
    const summary = await calculateSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate summary',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense (optional maintenance)
 */
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    const summary = await calculateSummary();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense,
      summary,
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
};
