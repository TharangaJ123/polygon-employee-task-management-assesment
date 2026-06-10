import { type Request, type Response } from 'express';
import { AuthService } from '../services/AuthService.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await AuthService.getUserByEmail(email);
    
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await AuthService.validatePassword(password, user.password!);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Omit password from response object
    const { password: _, ...userWithoutPassword } = user;

    const token = AuthService.generateToken(user);

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
