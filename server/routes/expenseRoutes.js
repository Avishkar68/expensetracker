import express from 'express';
import {
  getExpenses,
  createExpense,
  updateExpenseStatus,
  getExpenseSummary,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/summary')
  .get(getExpenseSummary);

router.route('/:id/status')
  .patch(updateExpenseStatus);

router.route('/:id')
  .delete(deleteExpense);

export default router;
