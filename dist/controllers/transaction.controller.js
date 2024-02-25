"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTransactions = exports.transferFunds = exports.getUserBalance = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const transactionHistory_model_1 = __importDefault(require("../models/transactionHistory.model"));
const getUserBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ balance: user.balance });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getUserBalance = getUserBalance;
const transferFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, recipientId, amount, fee } = req.body;
        const sender = yield user_model_1.default.findById(senderId);
        const recipient = yield user_model_1.default.findById(recipientId);
        if (!sender || !recipient) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (sender.balance < amount + fee) {
            res.status(400).json({ error: 'Insufficient funds' });
            return;
        }
        sender.balance -= amount + fee;
        yield sender.save();
        recipient.balance += amount;
        yield recipient.save();
        yield transactionHistory_model_1.default.create({
            userId: senderId,
            amount: amount + fee,
            type: 'debit',
        });
        yield transactionHistory_model_1.default.create({
            userId: recipientId,
            amount,
            type: 'credit',
        });
        res.json({ message: 'Funds transferred successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.transferFunds = transferFunds;
const getUserTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const transactions = yield transactionHistory_model_1.default.find({ userId });
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getUserTransactions = getUserTransactions;
