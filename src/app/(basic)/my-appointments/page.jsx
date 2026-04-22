"use client";

import { getMyAppointments } from "@/app/actions/appointments";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import MyAppointmentCard from "./MyAppointmentCard";

export default function MyAppointmentsPage() {
    const [phone, setPhone] = useState("");
    const [tempPhone, setTempPhone] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initModalFn = () => {
            const stored = localStorage.getItem("patientPhone");

            if (!stored) {
                setShowModal(true);
            } else {
                setPhone(stored);
            }
        }

        initModalFn();
    }, []);

    useEffect(() => {
        if (!phone) return;

        async function load() {
            const data = await getMyAppointments(phone);
            setAppointments(data);
        }

        load();
    }, [phone]);

    // 🔹 submit phone
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tempPhone) return;

        localStorage.setItem("patientPhone", tempPhone);
        setPhone(tempPhone);
        setShowModal(false);
        router.refresh();
    };

    // 🔹 change number
    const handleChangeNumber = () => {
        localStorage.removeItem("patientPhone");
        setPhone("");
        setTempPhone("");
        setShowModal(true);
    };

    return (
        <section className="bg-bg min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-text">
                        My Appointments
                    </h1>


                    <button
                        onClick={handleChangeNumber}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Change Number
                    </button>

                </div>

                {/* PHONE INFO */}
                {phone && (
                    <p className="text-sm text-gray-500 mb-6">
                        Showing appointments for:{" "}
                        <span className="font-medium text-text">{phone}</span>
                    </p>
                )}

                {/* APPOINTMENTS */}
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            No appointments found
                        </div>
                    ) : (
                        appointments.map((item) => <MyAppointmentCard key={item._id} item={item} setAppointments={setAppointments} />)
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-bg w-full max-w-sm rounded-2xl p-6 relative shadow-lg">

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-primary"
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-lg font-semibold text-text mb-4">
                            Enter Your Phone
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                            />

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-xl font-medium"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}