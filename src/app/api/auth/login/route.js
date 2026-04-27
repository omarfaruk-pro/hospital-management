import { NextResponse } from "next/server";
import { saveRefreshToken } from "@/app/actions/authAction";
import { getUserByEmail, getUserById } from "@/app/actions/user";
import { verifyCsrf } from "@/app/lib/auth/csrf";
import { createAccessToken, createRefreshToken } from "@/app/lib/auth/jwt";
import bcrypt from "bcryptjs";


export async function POST(req) {
    try {
        verifyCsrf(req);

        const { email, password } = await req.json();
        const user = await getUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const payload = { id: user._id, role: user.role };

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        await saveRefreshToken(user._id, refreshToken);
        const finalUser = await getUserById(user._id);

        const res = NextResponse.json({success: true, message: "Login successful", finalUser});

        res.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return res;

    } catch (err) {
        return NextResponse.json(
            { message: "Forbidden" },
            { status: 403 }
        );
    }
}