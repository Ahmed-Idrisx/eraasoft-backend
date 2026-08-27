import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

export function notFound(req: Request, res: Response, next: NextFunction) {
  return errorResponse(
    res,
    404,
    `Route ${req.method} ${req.originalUrl} not found`,
    "ROUTE_NOT_FOUND",
  );
}

export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Global error:", error);

  return errorResponse(
    res,
    500,
    "Something went wrong",
    "INTERNAL_SERVER_ERROR",
  );
}
