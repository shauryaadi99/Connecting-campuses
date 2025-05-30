import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // 1. Try to get token from cookies
    let token = req.cookies?.token;
    console.log("[Auth] Token from cookies:", token);

    // 2. If not in cookies, try Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("[Auth] Token from Authorization header:", token);
    }

    // 3. No token found
    if (!token) {
      console.log("[Auth] No token found");
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });
    }

    // 4. Verify and decode token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("[Auth] Token decoded:", decoded);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error("[Auth] Error verifying token:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
};

export default isAuthenticated;
