import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const token = crypto.randomBytes(32).toString("hex");

  const res = NextResponse.json({ csrfToken: token });

  res.cookies.set("csrfToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    path: "/", 
  });

  return res;
}