import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "unigap-default-jwt-secret-key-2026";

export type AuthPayload = {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
};

export function createToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as AuthPayload;
  } catch (error) {
    return null;
  }
}