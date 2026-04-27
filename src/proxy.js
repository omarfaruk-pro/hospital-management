import { NextResponse } from "next/server";
import { verifyAccessToken } from "./app/lib/auth/jwt";

export function proxy(req) {
    const token = req.cookies.get("accessToken")?.value;
    const { pathname } = req.nextUrl;


    if (pathname === "/login") {
        if (token) {
            try {
                verifyAccessToken(token);
                return NextResponse.redirect(new URL("/", req.url));
            } catch {
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    if (
        pathname.startsWith("/lab") ||
        pathname.startsWith("/test") ||
        pathname.startsWith("/manager")
    ) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const decoded = verifyAccessToken(token);
            const role = decoded.role;

            if (role === "manager") {
                return NextResponse.next();
            }

            if (role === "lab-assistant" && pathname.startsWith("/lab")) {
                return NextResponse.next();
            }

            if (role === "receptionist" && pathname.startsWith("/test")) {
                return NextResponse.next();
            }

            return NextResponse.redirect(new URL("/", req.url));

        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/lab/:path*", "/test/:path*", "/manager/:path*"],
};