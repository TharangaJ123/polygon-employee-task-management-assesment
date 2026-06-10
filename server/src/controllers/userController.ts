import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { UserService } from '../services/UserService.js';

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await UserService.getEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const { userId } = req.user!;

    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    await UserService.updateProfileName(userId, name);
    
    // Fetch updated user to return
    const updatedUser = await UserService.getUserById(userId);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    // Generate salt and hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const employeeId = await UserService.createEmployee(name, email, passwordHash);
    
    res.status(201).json({ message: 'Employee created successfully', id: employeeId });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
