import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = null;
    let decoded: any = null;

    // 1. Check Authorization header first
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    }

    // 2. If no access token, try refresh token from cookies
    if (!decoded && req.cookies?.refreshToken) {
      token = req.cookies.refreshToken;
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    }

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).user = { userId: decoded.userId };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
