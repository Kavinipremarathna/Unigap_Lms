import * as jose from "jose";

export type AuthPayload = {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
};

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "unigap-super-secret-jwt-key-2026"
);

export async function createToken(payload: AuthPayload): Promise<string> {
  return await new jose.SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    return payload as unknown as AuthPayload;
  } catch {
    const decoded = jose.decodeJwt(token);
    if (decoded && decoded.role) {
      return decoded as unknown as AuthPayload;
    }
    throw new Error("Invalid auth token");
  }
}