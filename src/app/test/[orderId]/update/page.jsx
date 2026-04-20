"use client";
import { findOrderById, updateTestPaymentStatus } from "@/app/actions/tests";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdPayments, MdPerson, MdOutlineReceiptLong, MdArrowBack } from "react-icons/md";
import Swal from "sweetalert2";
import PaymentSkeleton from "./PaymentSkeleton";

export default function OrderPaymentPage() {
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collectAmount, setCollectAmount] = useState(0);

    useEffect(() => {
        const getOrder = async () => {
            setLoading(true);
            const res = await findOrderById(orderId);
            setOrder(res.order);
            setLoading(false);
        };
        getOrder();
    }, [orderId]);

    if (loading) return <PaymentSkeleton />;

    const paid = Number(order?.paidAmount || 0);
    const due = Number(order?.dueAmount || 0);
    const newPaid = paid + collectAmount;

    const updatePayment = async () => {
        if (collectAmount !== due) {
            Swal.fire({
                icon: "error",
                title: "Incomplete Amount",
                text: `You must collect the full remaining balance of ৳${due}`,
                confirmButtonColor: "#3b82f6"
            });
            return;
        }
        
        const res = await updateTestPaymentStatus(orderId, newPaid);
        if (res.success) {
            Swal.fire({
                icon: "success",
                title: "Payment Updated",
                text: "The invoice has been cleared.",
                confirmButtonColor: "#10b981"
            });
            setCollectAmount(0);
            const updated = await findOrderById(orderId);
            setOrder(updated.order);
        } else {
            Swal.fire({ icon: "error", title: "Error", text: res.message });
        }
    };

    return (
        <div className="bg-bg min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/test" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <MdArrowBack size={24} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-black text-text">Process Payment</h1>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* LEFT SIDE: Info & Action */}
                    <div className="col-span-12 lg:col-span-4 space-y-6 ">
                        
                        {/* Patient Info Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black text-text mb-4 flex items-center gap-2">
                                <MdPerson className="text-primary" /> Patient Record
                            </h2>
                            <div className="space-y-3 p-4 bg-bg rounded-2xl border border-gray-50">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</p>
                                    <p className="font-bold text-text">{order?.patient?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Number</p>
                                    <p className="font-bold text-text">{order?.patient?.phone}</p>
                                </div>
                                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500">ID: {order?.patientId}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                        order?.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {order?.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Collection Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-5">
                            <h2 className="text-lg font-black text-text mb-6 flex items-center gap-2">
                                <MdPayments className="text-secondary" /> Collection Desk
                            </h2>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-sm font-medium text-gray-500">Total Bill</span>
                                    <span className="text-lg font-black text-text">৳{order.total}</span>
                                </div>

                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex justify-between items-center">
                                    <span className="text-xs font-black text-red-400 uppercase tracking-widest">Outstanding Due</span>
                                    <span className="text-xl font-black text-red-600 animate-pulse">৳{due}</span>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Amount to Collect</label>
                                    <input
                                        type="number"
                                        value={collectAmount || ""}
                                        onChange={(e) => setCollectAmount(Math.min(due, Number(e.target.value)))}
                                        placeholder="0.00"
                                        className="w-full p-4 bg-bg border-2 border-transparent focus:border-secondary/20 rounded-2xl text-xl font-black text-secondary outline-none transition-all"
                                    />
                                    {collectAmount > 0 && collectAmount < due && (
                                        <p className="text-[10px] text-orange-500 font-bold mt-2 italic px-1">Note: Policy requires full collection of due amount.</p>
                                    )}
                                </div>

                                {order.paymentStatus !== "paid" ? (
                                    <button
                                        disabled={collectAmount <= 0}
                                        onClick={updatePayment}
                                        className="w-full bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:grayscale"
                                    >
                                        Update Account
                                    </button>
                                ) : (
                                    <Link href={`/test/${orderId}/view`}
                                        className="w-full block text-center bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-1 transition-all"
                                    >
                                        Print Final Invoice
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Detailed Summary */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h2 className="text-xl font-black text-text flex items-center gap-3">
                                    <MdOutlineReceiptLong className="text-primary" size={28} /> 
                                    Order Summary
                                </h2>
                                <span className="bg-white px-4 py-1 rounded-full border border-gray-100 text-xs font-bold text-gray-400">
                                    INV-{order.orderId}
                                </span>
                            </div>

                            <div className="p-8 space-y-4">
                                {order?.testDetails?.map((t, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 bg-bg rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                                        <div>
                                            <p className="font-bold text-text">{t.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Clinical Diagnostic</p>
                                        </div>
                                        <span className="text-lg font-black text-primary">৳{t.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                                <div className="max-w-sm ml-auto space-y-3">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Sub-Total Amount</span>
                                        <span className="font-bold">৳{order.total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-600 bg-green-50/50 p-2 rounded-lg">
                                        <span>Total Paid to Date</span>
                                        <span className="font-bold">৳{paid}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <span className="font-black uppercase text-xs text-text">Net Balance Due</span>
                                        <span className="text-3xl font-black text-red-600">৳{due}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
