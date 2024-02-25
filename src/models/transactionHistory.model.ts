import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  sender: {
    id: string;
    name: string;
  };
  recipient: {
    id: string;
    name: string;
  };
  amount: number;
  type: 'credit' | 'debit';
  date: Date;
}

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
  },
  recipient: {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
  },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);