"use client";
import { AuthContext } from "@/app/context/AuthContext";
import { getCsrfToken } from "@/app/lib/auth/csrf";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();
    const {setUser} = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        const csrfToken = await getCsrfToken();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrfToken,
            },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data.finalUser);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: data.message,
            })
            router.push("/");
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Invalid credentials",
            });
        }
    };

    return (
        <section>
            <div className="container">
                <form onSubmit={handleLogin}>
                    <input
                        placeholder="Email"
                        type="email"
                        className="block border"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        className="block border"
                        placeholder="Password"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded" type="submit">Login</button>
                </form>
            </div>
        </section>
    );
}