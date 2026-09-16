import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.registerUser({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      message: "Logged in successfully",
      ...result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshSession(refreshToken);

    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutUser(refreshToken);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await authService.verifyAccessToken(token);
    req.user = decoded;

    // Now 'next' exists and will pass execution to generateComponentStream
    next();
  } catch (err) {
    console.error("JWT Verification failed with error:", err.name, err.message);
    return res
      .status(401)
      .json({ valid: false, message: "Invalid or expired token" });
  }
};
