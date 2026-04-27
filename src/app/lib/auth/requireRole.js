import { verifyAccessToken } from "./jwt";

export const requireRole = (roles = []) => {
    return (req) => {
        const token = req.cookies.get("accessToken")?.value;

        if (!token) return null;

        try {
            const decoded = verifyAccessToken(token);
            if (!roles.includes(decoded.role)) return null;
            return decoded;
        } catch {
            return null;
        }
    };
};