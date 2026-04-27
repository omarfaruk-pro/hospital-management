"use client"

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function LoggedIn() {
    const { user, setUser } = useContext(AuthContext);
    console.log(user)

    const handleLogout = async () => {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: data.message,
            })
            setUser(null);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong",
            })
        }
    };
    return (
        <>
            {user && <>
                <div onClick={handleLogout} className="h-12 w-12 rounded-full bg-black text-white fixed top-1/2 left-0 flex justify-center items-center text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </>}
        </>
    )
}
