import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}

export type AuthPayload = {
    userId: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
};

export function createToken(payload: AuthPayload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyToken(token: string): AuthPayload {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
}