import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import Session from "../models/session.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;
    console.log(username, email, password, role);
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: `All fields are required`,
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: `Password not matches`,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(402).json({
        success: false,
        message: "User Already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "Author",
    });
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with email not exists.",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password.",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // remove previous sessions for the user
    await Session.deleteMany({ userId: user._id });

    const session = await Session.create({
      userId: user._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // set cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: (process.env.NODE_ENV = "production"),
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: (process.env.NODE_ENV = "production"),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Login Successful",
      data: session,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error in login ${error.message}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Get token from cookies
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token found",
      });
    }

    // delete session
    await Session.deleteOne({ accessToken: token });

    // clear cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Logout failed: ${error.message}`,
    });
  }
};
