import jwt from "jsonwebtoken";

export type AuthPayload = {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
};

function getSecret(): string {
  return process.env.JWT_SECRET || "unigap-super-secret-jwt-key-2026";
}

export function createToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, getSecret());
  return decoded as unknown as AuthPayload;
}