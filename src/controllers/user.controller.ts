import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';

interface IUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance:number
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {firstName,lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName,lastName, email, password: hashedPassword });
  await newUser.save();
 
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    req.session.userId = user._id; 

    console.log(req.session.userId, "session")
    const userResponse: IUserResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      balance:user.balance
    };
    res.status(200).json({ message: 'Login successful',userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  export const logoutUser = (req: Request, res: Response): void => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  };


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};