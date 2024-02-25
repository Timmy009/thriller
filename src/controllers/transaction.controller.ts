import { Request, Response } from 'express';
import User from '../models/user.model';
import Transaction from '../models/transactionHistory.model';

export const getUserBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const transferFunds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, recipientId, amount, fee } = req.body;

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (sender.balance < amount + fee) {
      res.status(400).json({ error: 'Insufficient funds' });
      return;
    }

    sender.balance -= amount + fee;
    await sender.save();

    recipient.balance += amount;
    await recipient.save();

    const senderTransaction = await Transaction.create({
      userId: senderId,
      sender: {
        id: senderId,
        name: sender.lastName + " " + sender.firstName,
      },
      recipient: {
        id: recipientId,
       name: recipient.lastName + " " + recipient.firstName,
      },
      amount: amount + fee,
      type: 'debit',
    });

    const recipientTransaction = await Transaction.create({
      userId: recipientId,
      sender: {
        id: senderId,
     name: sender.lastName + " " + sender.firstName,
      },
      recipient: {
        id: recipientId,
            name: recipient.lastName + " " + recipient.firstName,
      },
      amount,
      type: 'credit',
    });

    res.json({ message: 'Funds transferred successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};