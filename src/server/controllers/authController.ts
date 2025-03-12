import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, gender, country, phoneNumber, age_group } = req.body;

    // Validate required fields
    if (!age_group) {
      return res.status(400).json({ message: 'Age group is required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      gender,
      country,
      phoneNumber,
      age_group, // Include age_group
      dateJoined: new Date(),
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        country: user.country,
        phoneNumber: user.phoneNumber,
        age_group: user.age_group, // Include age_group in response
        dateJoined: user.dateJoined,
        faceVerified: user.faceVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        country: user.country,
        phoneNumber: user.phoneNumber,
        age_group: user.age_group, // Include age_group in response
        dateJoined: user.dateJoined,
        faceVerified: user.faceVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Update last active timestamp
    const user = await User.findById(req.user.userId);
    if (user) {
      user.lastActive = new Date();
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};
