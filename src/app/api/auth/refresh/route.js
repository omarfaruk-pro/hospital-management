import { NextResponse } from "next/server";
import { checkRefreshToken } from "@/app/actions/authAction";
import { createAccessToken, verifyRefreshToken } from "@/app/lib/auth/jwt";

export const runtime = "nodejs";

export async function POST(req) {
    const token = req.cookies.get("refreshToken")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "No refresh token" },
            { status: 401 }
        );
    }

    try {
        const decoded = verifyRefreshToken(token);
        const valid = await checkRefreshToken(decoded.id, token);
        console.log("valid" , valid)
        if (!valid) {
            throw new Error("Invalid token in DB");
        }

        const newAccess = createAccessToken({
            id: decoded.id,
            role: decoded.role,
        });

        const res = NextResponse.json({
            message: "Access token refreshed",
        });

        res.cookies.set("accessToken", newAccess, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return res;

    } catch {
        return NextResponse.json(
            { message: "Invalid or expired refresh token" },
            { status: 403 }
        );
    }
}