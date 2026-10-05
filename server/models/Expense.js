import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
      min: [1, 'Amount must be at least ₹1'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the expense'],
      trim: true,
      maxlength: [300, 'Reason cannot exceed 300 characters'],
    },
    paidBy: {
      type: String,
      required: [true, 'Please specify who paid for the expense'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'done'],
        message: 'Status must be either pending or done',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Index for fast sorting and searching
expenseSchema.index({ createdAt: -1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ paidBy: 'text', reason: 'text' });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
