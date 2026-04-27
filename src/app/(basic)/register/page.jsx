"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const router = useRouter();
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "Please provide all the required information.",
            })
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },
        });
        let data;

        try {
            data = await res.json();
        } catch {
            data = { message: "Something went wrong" };
        }

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Registered Successfully",
                text: data.message || "Account created successfully",
            });
            setForm({ name: "", email: "", password: "" });
            router.push("/login");
        } else {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: data.message || "Something went wrong",
            });
        }
    };

    return (
        <form onSubmit={handleRegister} className="container flex flex-col gap-5">
            <input placeholder="Name" type="text" onChange={(e) => setForm({ ...form, name: e.target.value })} className="block border " />
            <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="block border" />
            <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} className="block border" />
            <button type="submit" className="bg-blue-600 px-6 py-2 rounded-md text-black font-semibold">Register</button>
        </form>
    );
}