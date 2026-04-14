"use client";

import { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createAppointment } from "@/app/actions/appointments";

export default function AppointmentBtn({ doctor, className }) {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [showCalendar, setShowCalendar] = useState(false);
    const modalRef = useRef();

    // outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);


    const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };

    const allowedDays = doctor?.schedule?.map((s) => dayMap[s.day]) || [];

    // submit
    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const phone = form.phone.value;
        const email = form.email.value;

        if (!name || !phone) {
            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "Please provide both your name and phone number.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            return;
        }

        if (!selectedDate) {
            Swal.fire({
                icon: "error",
                title: "Select Date",
                text: "Please select an available date.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            return;
        }

        const data = {
            name,
            phone,
            email,
            date: selectedDate,
            doctorId: doctor._id,
            type:"OPD",
            status:"confirm",
            createdAt: new Date(),
        };


        const res = await createAppointment(data);
        console.log(res, selectedDate)
        Swal.fire({ 
            icon: "success",
            title: "Appointment Requested",
            text: "We will confirm your appointment shortly.",
        });

        setOpen(false);
        setSelectedDate(undefined);
        form.reset();
    };

    return (
        <>
            {/* BUTTON */}
            <button onClick={() => setOpen(true)} className={className}>
                Book Appointment
            </button>

            {/* MODAL */}
            {open && (
                <div className="fixed top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 inset-0 z-50 flex items-center justify-center px-4 bg-black/40 animate-fadeIn">
                    <div
                        ref={modalRef}
                        className="bg-bg w-full max-w-md rounded-2xl p-6 shadow-lg relative animate-scaleIn text-text"
                    >
                        {/* CLOSE */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-primary"
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-xl font-semibold mb-2">
                            Book Appointment
                        </h2>

                        <p className="text-sm text-gray-500 mb-4">
                            {doctor?.name}
                        </p>

                        {/* AVAILABLE DAYS */}
                        <p className="text-xs text-gray-500 mb-4">
                            Available on: {doctor.schedule.map((s) => s.day).join(", ")}
                        </p>

                        <form
                            className="space-y-4"
                            onSubmit={handleAppointmentSubmit}
                        >
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="mt-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="mt-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Email (optional)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="mt-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium mb-2">
                                    Select Date
                                </label>

                                {/* trigger button */}
                                <button
                                    type="button"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-xl"
                                >
                                    {selectedDate
                                        ? selectedDate.toDateString()
                                        : "Choose a date"}
                                </button>

                                {/* popup calendar */}
                                {showCalendar && (
                                    <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 shadow-lg absolute z-10 left-0 bottom-0">
                                        <DayPicker
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setShowCalendar(false); // auto close
                                            }}
                                            disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0); // normalize

                                                return (
                                                    date < today || // ❌ past disable
                                                    !allowedDays.includes(date.getDay()) // ❌ wrong weekday disable
                                                );
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="w-full mt-4 bg-primary hover:bg-secondary text-white py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl"
                            >
                                Confirm Appointment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}