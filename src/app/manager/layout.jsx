import { cookies } from "next/headers";
import ManagerSideBar from "./ManagerSideBar";
import { verifyAccessToken } from "../lib/auth/jwt";
import { redirect } from "next/navigation";


export default async function ManagerLayout({ children }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken').value

    if (!token) redirect("/login");

    try {
        const decoded = verifyAccessToken(token);

        if (decoded.role !== "manager") {
            redirect("/");
        }
    } catch {
        redirect("/login");
    }
    return (
        <>
            <ManagerSideBar />
            {children}
        </>
    )
}
