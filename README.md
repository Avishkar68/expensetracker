# 💰 Marketing Expenses Tracker

A very simple, clean, and modern internal web application designed specifically for the marketing team to record expenses on-the-go and track reimbursements.

---

## ⚡ Core Highlights

- **Ultra-Fast Entry (< 10s)**: Add expenses on your phone with only 3 inputs: Amount, Reason, and Paid By.
- **Automatic Timestamps**: Date and Time are automatically captured and stored on the server — no manual date picking.
- **Live Summary**: Instant real-time calculation of **Total Expenses**, **Pending to Pay**, and **Paid/Settled** balances directly synced with MongoDB.
- **Mobile-First UX**: Responsive mobile card view with prominent amounts, touch-friendly `[Mark Done]` button, and floating action button.
- **No Distractions**: No complex charts, budgets, invoices, login, or roles. Just clean expense tracking.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), JavaScript (No TypeScript), Vanilla CSS design system, Lucide icons.
- **Backend**: Node.js, Express.js (REST API).
- **Database**: MongoDB Atlas with Mongoose models & aggregation pipelines.
- **Environment**: `.env` configuration for secure connection strings.

---

## 📂 Project Structure

```text
expensetracker/
├── package.json              # Monorepo root scripts (npm run dev, build, etc.)
├── .gitignore
├── README.md
├── client/                   # Vite + React Frontend
│   ├── index.html            # Plus Jakarta Sans typography & mobile viewport
│   ├── vite.config.js        # API proxy config
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # Main state, optimistic updates & notifications
│       ├── index.css         # Modern, mobile-first Vanilla CSS design system
│       ├── components/
│       │   ├── Header.jsx           # Dashboard header with "+ Add Expense" & "View Expenses"
│       │   ├── SummaryCards.jsx     # Total, Pending, Settled financial metrics
│       │   ├── FilterBar.jsx        # All / Pending / Done tabs & real-time search
│       │   ├── ExpenseList.jsx      # Desktop table & touch-friendly mobile cards
│       │   ├── AddExpenseModal.jsx  # Rapid modal with chips & auto-timestamp notice
│       │   ├── EmptyState.jsx       # Zero-data and no-results views
│       │   ├── LoadingSkeleton.jsx  # Shimmer loading skeleton
│       │   └── Toast.jsx            # Sleek notification toasts
│       ├── services/
│       │   └── api.js        # REST API client
│       └── utils/
│           └── formatters.js # Indian Rupee (₹) formatting & date/time utilities
└── server/                   # Express REST API Backend
    ├── server.js             # Express app & middleware
    ├── .env                  # MongoDB Atlas connection & PORT
    ├── .env.example          # Environment template
    ├── package.json
    ├── config/
    │   └── db.js             # Mongoose connection with error handling
    ├── models/
    │   └── Expense.js        # Mongoose schema with timestamps & validations
    ├── controllers/
    │   └── expenseController.js # CRUD handlers & MongoDB aggregation summaries
    └── routes/
        └── expenseRoutes.js  # REST routes
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas cluster connection string

### 2. Environment Setup
The server configuration is located in `server/.env`. A template is provided in `server/.env.example`:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/marketing_expense_tracker?retryWrites=true&w=majority
```

### 3. Install Dependencies
Run the install command from the root directory:

```bash
npm run install:all
```

### 4. Run Locally
Start both backend and frontend concurrently with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173/](http://localhost:5173/) (or next available port)
- **Backend API**: [http://localhost:5001/api/expenses](http://localhost:5001/api/expenses)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Get all expenses (supports `?status=pending\|done` and `?search=...`) |
| `POST` | `/api/expenses` | Create a new expense (`{ amount, reason, paidBy }`) |
| `PATCH` | `/api/expenses/:id/status` | Update status to `done` or `pending` |
| `GET` | `/api/expenses/summary` | Get aggregated financial metrics |
| `DELETE` | `/api/expenses/:id` | Delete an expense document |

---

## 🔒 Security Note
- Real credentials and `.env` files are ignored by `.gitignore`.
- MongoDB connection strings are kept exclusively on the server and are never exposed to the frontend.
