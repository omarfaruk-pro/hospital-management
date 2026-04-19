"use client";
import { cancelAppointment } from "@/app/actions/appointments";
import Image from "next/image";
import Swal from "sweetalert2";

export default function MyAppointmentCard({ item, setAppointments }) {

console.log(item)
    const appointmentDate = new Date(item.date);


    const dayName = appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
    });


    const matchedSchedules = item.schedule?.filter(
        (s) => s.day === dayName
    ) || [];

    const now = new Date();

    let statusBadge = "Upcoming";
    let badgeStyle = "bg-primary text-white animate-pulse";
    let displayTime = "";

    if (matchedSchedules.length) {
        let isRunning = false;
        let isEndedAll = true;

        for (const s of matchedSchedules) {
            const [sh, sm] = s.startTime.split(":");
            const [eh, em] = s.endTime.split(":");

            const start = new Date(appointmentDate);
            start.setHours(sh, sm, 0);

            const end = new Date(appointmentDate);
            end.setHours(eh, em, 0);

            // 👉 display first slot (UI purpose)
            if (!displayTime) {
                displayTime = `${s.startTime} - ${s.endTime}`;
            }

            if (now >= start && now <= end) {
                isRunning = true;
                isEndedAll = false;
                displayTime = `${s.startTime} - ${s.endTime}`;
                break;
            }

            if (now < end) {
                isEndedAll = false;
            }
        }

        if (isRunning) {
            statusBadge = "Running";
            badgeStyle = "bg-green-500 text-white";
        } else if (isEndedAll) {
            statusBadge = "Ended";
            badgeStyle = "bg-gray-300 text-gray-700";
        }
    } else {
        statusBadge = "No Schedule";
        badgeStyle = "bg-red-100 text-red-600";
    }


    const cancelAppointmentBtn = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this appointment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await cancelAppointment(item._id);
                if (res.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Cancelled",
                        text: "Your appointment has been cancelled.",
                    });
                    setAppointments(prev =>
                        prev.map(a =>
                            a._id === item._id
                                ? { ...a, status: "cancel" }
                                : a
                        )
                    );
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to cancel the appointment. Please try again.",
                    });
                }
            }
        });
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* LEFT */}
            <div className="flex items-start gap-4">

                {/* Image */}
                <Image
                    height={100}
                    width={100}
                    src={item.photoUrl}
                    alt={item.doctorName}
                    className="w-16 h-16 rounded-xl object-cover border"
                />

                {/* Info */}
                <div>

                    <h2 className="text-lg font-semibold text-text">
                        {item.doctorName}
                    </h2>

                    <p className="text-sm text-gray-500">
                        {item.designation}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">

                        <span className="text-gray-500">
                            📅 <span className="text-text">
                                {appointmentDate.toDateString()}
                            </span>
                        </span>

                        <span className="text-gray-500">
                            🕒 {displayTime || "N/A"}
                        </span>

                        <span className="text-gray-500">
                            Serial:
                            <span className="ml-1 font-semibold text-primary">
                                #{item.serialNo}
                            </span>
                        </span>

                    </div>

                    {/* STATUS */}
                    <div className="flex items-center gap-2 mt-3">

                        {/* DB STATUS */}
                        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            {item.status}
                        </span>

                        {/* TIME STATUS */}
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyle}`}>
                            {statusBadge}
                        </span>

                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-2">

                {/* Cancel only upcoming */}
                {statusBadge === "Upcoming" && item.status === "confirm" && (
                    <button onClick={cancelAppointmentBtn} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                        Cancel
                    </button>
                )}

                {statusBadge === "Running" && (
                    <span className="text-xs text-green-600 font-medium">
                        Consultation ongoing
                    </span>
                )}

                {statusBadge === "Ended" && (
                    <span className="text-xs text-gray-500">
                        Session finished
                    </span>
                )}

            </div>
        </div>
    );
}