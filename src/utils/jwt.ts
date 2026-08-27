import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(userId: number) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
