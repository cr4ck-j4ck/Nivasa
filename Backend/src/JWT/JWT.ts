import jwt from "jsonwebtoken"
import User from "../Models/UsersModel";

// JWT Middleware
export const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    req.user.isLoggedin = true;
    next();
  } catch (error:unknown) {
    if (error instanceof(Error) && error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

export const generateToken = (userId:  object ,expireTime : "10min" | "7d") => {
  return jwt.sign(
    userId ,
    process.env.JWT_SECRET!,
    { expiresIn: expireTime } 
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "30d" } // Refresh token expires in 30 days
  );
};