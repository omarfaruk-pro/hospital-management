"use client";

import { getMyTestsByMyId } from "@/app/actions/tests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import TableSkeleton from "./TableSkeleton";

export default function MyAllTestsPage() {
    const [patientId, setPatientId] = useState("");
    const [tempId, setTempId] = useState("");
    const [myTests, setMytests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [otp, setOtp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initModalFn = () => {
            setLoading(true);
            const stored = localStorage.getItem("patientId");

            if (!stored) {
                setShowModal(true);
            } else {
                setPatientId(stored.toUpperCase() || patientId);
            }
            setLoading(false);
        }

        initModalFn();
    }, [patientId]);

    useEffect(() => {
        if (!patientId) return;

        async function load() {
            setLoading(true);
            const data = await getMyTestsByMyId(patientId);
            setMytests(data.data);
            setLoading(false);
        }

        load();
    }, [patientId]);

    // 🔹 submit phone
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tempId) return;

        localStorage.setItem("patientId", tempId);
        setPatientId(tempId);
        setShowModal(false);
        router.refresh();
    };

    const handleChangeId = () => {
        localStorage.removeItem("patientId");
        setPatientId("");
        setTempId("");
        setShowModal(true);
    };

    const handleOtp = (oid) => {
        const random = Math.floor(Math.random() * 10000);
        Swal.fire({
            title: 'OTP',
            text: `Your OTP is ${random}`,
            icon: 'success',
        })
        setOtp({ oid, otp: random });
        setShowModal(true);
    }

    const handleSubmitOtp = (e) => {
        e.preventDefault();
        console.log(otp, e.target.otp.value)
        if (otp.otp === Number(e.target.otp.value)) {
            Swal.fire({
                title: 'Success',
                text: 'OTP Matched',
                icon: 'success',
            })
            setShowModal(false);
            router.push(`/report/${otp.oid}`);
            setOtp(null);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'OTP Not Matched',
                icon: 'error',
            })
        }
    }
    return (
        <section className="bg-bg min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-text">
                        My Appointments
                    </h1>


                    <button
                        onClick={handleChangeId}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Change ID
                    </button>

                </div>

                {/* PHONE INFO */}
                {patientId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Showing Tests for:{" "}
                        <span className="font-medium text-text">{patientId}</span>
                    </p>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Patient</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Billing</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {
                                    loading && <TableSkeleton />
                                }
                                {(!loading && myTests.length > 0) ? myTests.map((o) => (
                                    <tr key={o._id} className="hover:bg-bg/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="font-bold text-text group-hover:text-primary transition-colors">{o.orderId}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">
                                                {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <h2 className="font-bold text-text group-hover:text-primary transition-colors">{o.patientName}</h2>
                                            <div className="text-xs text-gray-500 font-medium">{o.patientPhone}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-secondary">৳{Number(o.total).toLocaleString()}</span>
                                                {Number(o.dueAmount) > 0 && (
                                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded mt-1 self-start">
                                                        Due: ৳{o.dueAmount}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${o.paymentStatus === "paid"
                                                    ? "bg-green-50 text-green-600 border-green-100"
                                                    : "bg-red-50 text-red-600 border-red-100"
                                                    }`}>
                                                    {o.paymentStatus}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight ml-1">
                                                    ● {o.orderStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-end gap-2">

                                                {
                                                    (o.paymentStatus === "paid" && o.orderStatus === "completed") ? (
                                                        <button onClick={() => handleOtp(o._id)} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm" title="Update">
                                                            Get Report
                                                        </button>
                                                    ) : (
                                                        <span>Pay First to get Report</span>
                                                    )
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-gray-400 font-medium italic">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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

                        {!otp && <>
                            <h2 className="text-lg font-semibold text-text mb-4">
                                Enter Your Phone
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="P-0000"
                                    value={tempId}
                                    onChange={(e) => setTempId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-xl font-medium"
                                >
                                    Continue
                                </button>
                            </form>
                        </>
                        }

                        {otp && <>
                            <h2 className="text-lg font-semibold text-text mb-4">
                                Enter Your Otp
                            </h2>

                            <form onSubmit={handleSubmitOtp} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Otp"
                                    defaultValue=""
                                    name="otp"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-xl font-medium"
                                >
                                    Enter
                                </button>
                            </form>
                        </>
                        }
                    </div>
                </div>
            )}
        </section>
    );
}