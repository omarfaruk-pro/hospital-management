"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteTestOrder, getAllTestOrders } from "../actions/tests";
import Link from "next/link";
import Swal from "sweetalert2";
import {
    MdSearch, MdFilterList, MdAdd, MdVisibility,
    MdEdit, MdDelete, MdPayment, MdHistory
} from "react-icons/md";

export default function AllTestPage() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const getAllTests = async () => {
            setLoading(true);
            const res = await getAllTestOrders();
            if (res.success) {
                setOrders(res.data);
            }
            setLoading(false);
        }
        getAllTests();
    }, []);

    const filteredOrders = useMemo(() => {
        let data = orders;
        if (search) {
            const q = search.toLowerCase();
            data = data.filter((o) =>
                o.patientId.toLowerCase().includes(q) ||
                o.patientPhone.toLowerCase().includes(q) ||
                o.patientName.toLowerCase().includes(q)
            );
        }
        if(filter === "unpaid") {
            data = data.filter((o) => o.paymentStatus === "unpaid" || o.paymentStatus === "partial");
        }else if (filter !== "all") {
            data = data.filter((o) => o.paymentStatus === filter);
        }
        return data;
    }, [orders, search, filter]);

    const paginated = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredOrders.slice(start, start + limit);
    }, [filteredOrders, page]);

    const totalPages = Math.ceil(filteredOrders.length / limit);

    const handleTestOrderDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteTestOrder(id);
                if (res.success) {
                    Swal.fire("Deleted!", res.message, "success");
                    setOrders(orders.filter((o) => o._id !== id));
                }
            }
        });
    };
    const getAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    };

    if (loading) return <TableSkeleton />;

    return (
        <section className="bg-bg min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-text flex items-center gap-2">
                            <MdHistory className="text-primary" /> Test Order Management
                        </h1>
                        <p className="text-gray-500 text-sm">Monitor and manage all diagnostic test requests.</p>
                    </div>
                    <Link
                        href="/test/entry"
                        className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 transform active:scale-95"
                    >
                        <MdAdd size={20} /> New Test Entry
                    </Link>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative w-full lg:flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Patient ID, Name, or Phone..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-4 py-3 bg-bg rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-bg p-1.5 rounded-2xl w-full lg:w-auto">
                        {['all', 'paid', 'unpaid'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`flex-1 lg:flex-none px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === status
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-gray-400 hover:text-text"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Container */}
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
                                {paginated.length > 0 ? paginated.map((o) => (
                                    <tr key={o._id} className="hover:bg-bg/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="font-bold text-text group-hover:text-primary transition-colors">{o.orderId}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">
                                                {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-text">{o.patientName} <small className="font-medium">({getAge(o.dob)})</small></div>
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
                                                <Link href={`/test/${o._id}/view`} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm" title="View">
                                                    <MdVisibility size={18} />
                                                </Link>
                                                <Link href={`/test/${o._id}/edit`} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm" title="Edit">
                                                    <MdEdit size={18} />
                                                </Link>
                                                <button onClick={() => handleTestOrderDelete(o._id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Delete">
                                                    <MdDelete size={18} />
                                                </button>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${page === p
                                    ? "bg-primary text-white scale-110"
                                    : "bg-white text-gray-400 hover:text-primary hover:bg-blue-50"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// 💀 Skeleton Loader Component
function TableSkeleton() {
    return (
        <div className="p-6 container mx-auto animate-pulse">
            <div className="flex justify-between mb-8">
                <div className="h-10 bg-gray-200 rounded-2xl w-48"></div>
                <div className="h-12 bg-gray-200 rounded-2xl w-40"></div>
            </div>
            <div className="h-16 bg-gray-200 rounded-3xl mb-6 w-full"></div>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-6 border-b border-gray-50 flex justify-between">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-100 rounded w-20"></div>
                        </div>
                        <div className="h-8 bg-gray-100 rounded-full w-20"></div>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                            <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}