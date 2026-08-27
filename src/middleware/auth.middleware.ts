import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { errorResponse } from "../utils/response";

interface JwtPayload {
  userId: number;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Authentication required", "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Authentication required", "UNAUTHORIZED");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid or expired token", "INVALID_TOKEN");
  }
}
