// API service layer for Marketing Expense Tracker

const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Helper to handle fetch responses and extract meaningful error messages
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      (isJson && (data.message || data.error)) ||
      `Server error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Fetch all expenses with optional status and search filter
 * @param {Object} options - { status: 'all' | 'pending' | 'done', search: string }
 */
export async function getExpenses({ status = 'all', search = '' } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'all') {
    params.append('status', status);
  }
  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${BASE_URL}/api/expenses${queryString}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Add a new expense
 * @param {Object} payload - { amount, reason, paidBy }
 */
export async function createExpense({ amount, reason, paidBy }) {
  const response = await fetch(`${BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      amount: Number(amount),
      reason: reason.trim(),
      paidBy: paidBy.trim(),
    }),
  });

  return handleResponse(response);
}

/**
 * Update the status of an expense (done or pending)
 * @param {string} id - Expense ID
 * @param {string} status - 'done' or 'pending'
 */
export async function updateExpenseStatus(id, status) {
  const response = await fetch(`${BASE_URL}/api/expenses/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
}

/**
 * Delete an expense
 * @param {string} id - Expense ID
 */
export async function deleteExpense(id) {
  const response = await fetch(`${BASE_URL}/api/expenses/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Fetch summary metrics directly
 */
export async function getExpenseSummary() {
  const response = await fetch(`${BASE_URL}/api/expenses/summary`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}
