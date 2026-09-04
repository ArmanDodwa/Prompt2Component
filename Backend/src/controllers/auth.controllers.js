import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';


const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const user = new User({ username, email, password });
  const { accessToken, refreshToken } = generateTokens(user);
  
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    message: 'User registered successfully',
    accessToken,
    refreshToken,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    message: 'Logged in successfully',
    accessToken,
    refreshToken,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(403).json({ message: 'Invalid session or token reuse detected' });
  }

  // Token Rotation Strategy (Issue new pair, overwrite old token in DB)
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

 
  await User.findOneAndUpdate(
    { refreshToken },
    { $set: { refreshToken: null } }
  );

  res.status(200).json({ message: 'Logged out successfully' });
};

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
};