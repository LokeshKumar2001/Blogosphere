import jwt from "jsonwebtoken";
import Session from "../models/session.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // we can get access token from cookies also
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Token not found.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const session = await Session.findOne({
      userId: decoded.id,
      accessToken: token,
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Session expired or invalid",
      });
    }

    // check session expiry
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(400).json({
        success: false,
        message: "Session expired",
      });
    }

    req.user = decoded; // id, role
    req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Invalid or expired ${error.message}`,
    });
  }
};
