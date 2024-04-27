import {Express, Request, Response} from "express";
import * as UserController from '../controllers/user.controller';


function routes (app:Express){
app.post('/users', UserController.createUser);  
app.post('/login', UserController.loginUser);
app.post('/logout', UserController.logoutUser);
app.get('/users', UserController.getAllUsers);
}

export default routes;