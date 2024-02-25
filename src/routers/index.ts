import {Express, Request, Response} from "express";
import * as UserController from '../controllers/user.controller';
import * as TransactionController from '../controllers/transaction.controller';
import { requireAuth } from "../middlewares/auth";


function routes (app:Express){
app.post('/users', UserController.createUser);
app.post('/login', UserController.loginUser);
app.post('/logout', UserController.logoutUser);
app.get('/users', UserController.getAllUsers);
app.get('/users/:userId/balance',  TransactionController.getUserBalance);
app.post('/transfer',  TransactionController.transferFunds);
app.get('/:userId/transactions',  TransactionController.getUserTransactions);
}

export default routes;