import { NextResponse } from "next/server";
import { deleteRefreshToken } from "@/app/actions/authAction";

export const runtime = "nodejs";

export async function POST(req) {
    const token = req.cookies.get("refreshToken")?.value;

    if (token) {
        await deleteRefreshToken(token);
    }

    const res = NextResponse.json({
        message: "Logged out successfully",
    });

    // 🔥 clear cookies properly
    res.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    res.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return res;
}