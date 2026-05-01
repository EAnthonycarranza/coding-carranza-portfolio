import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "carranza-portfolio-secret-change-me";

export function signToken(payload: { id: number; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyAuth(): Promise<{ id: number; username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string };
  } catch {
    return null;
  }
}
