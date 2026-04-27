import { NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/auth/jwt";

export function middleware(req) {
    const token = req.cookies.get("accessToken")?.value;

    console.log("token from middleware",token)
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        verifyAccessToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};