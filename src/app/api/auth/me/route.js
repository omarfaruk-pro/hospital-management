import { getUserById } from "@/app/actions/user";
import { verifyAccessToken } from "@/app/lib/auth/jwt";

export async function GET(req) {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) return Response.json({}, { status: 401 });

    try {
        const decoded = verifyAccessToken(token);
        
        const user = await getUserById(decoded.id);

        return Response.json(user);
    } catch(e) {
        console.log('errorsdfasdf',e)
        return Response.json({}, { status: 401 });
    }
}