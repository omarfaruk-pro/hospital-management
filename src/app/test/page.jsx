"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllTestOrders } from "../actions/tests";
import Link from "next/link";

export default function AllTestPage() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // pagination
    const [page, setPage] = useState(1);
    const limit = 10;


    useEffect(() => {
        const getAllTests = async () => {
            const res = await getAllTestOrders();

            if (res.success) {
                setOrders(res.data);
            }
        }
        getAllTests();
    }, []);

    // 🔍 search + filter
    const filteredOrders = useMemo(() => {
        let data = orders;

        // search (patientId + phone + name)
        if (search) {
            const q = search.toLowerCase();
            data = data.filter((o) =>
                o.patientId.toLowerCase().includes(q) ||
                o.patientPhone.toLowerCase().includes(q) ||
                o.patientName.toLowerCase().includes(q)
            );
        }

        // payment filter
        if (filter !== "all") {
            data = data.filter((o) => o.paymentStatus === filter);
        }

        return data;
    }, [orders, search, filter]);

    // pagination slice
    const paginated = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredOrders.slice(start, start + limit);
    }, [filteredOrders, page]);

    const totalPages = Math.ceil(filteredOrders.length / limit);

    return (
        <div className="p-6">

            {/* 🔝 Top Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">

                {/* Create Button */}
                <Link
                    href="/test/entry"
                    className="bg-primary text-white px-4 py-2 rounded font-semibold"
                >
                    + New Test Entry
                </Link>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by Patient ID / Phone / Name"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="p-2 border rounded w-full md:w-80"
                />

                {/* Filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1 rounded ${filter === "all" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("paid")}
                        className={`px-3 py-1 rounded ${filter === "paid" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    >
                        Paid
                    </button>
                    <button
                        onClick={() => setFilter("unpaid")}
                        className={`px-3 py-1 rounded ${filter === "unpaid" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                    >
                        Unpaid
                    </button>
                </div>
            </div>

            {/* 📊 Table */}
            <div className="overflow-x-auto border rounded">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2">Order ID</th>
                            <th className="p-2">Patient</th>
                            <th className="p-2">Phone</th>
                            <th className="p-2">Total</th>
                            <th className="p-2">Due</th>
                            <th className="p-2">Payment</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.map((o) => (
                            <tr key={o._id} className="border-t">
                                <td className="p-2 font-semibold">{o.orderId}</td>
                                <td className="p-2">{o.patientName}</td>
                                <td className="p-2">{o.patientPhone}</td>
                                <td className="p-2">৳{o.total}</td>
                                <td className="p-2 text-red-500">৳{o.dueAmount}</td>

                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${o.paymentStatus === "paid"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                        }`}>
                                        {o.paymentStatus}
                                    </span>
                                </td>

                                <td className="p-2">{o.orderStatus}</td>

                                <td className="p-2">
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </td>

                                {/* Actions */}
                                <td className="p-2 flex gap-2">
                                    <a href={`/dashboard/orders/${o._id}`} className="text-blue-600">View</a>
                                    <a href={`/dashboard/orders/edit/${o._id}`} className="text-yellow-600">Edit</a>
                                    <button className="text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📄 Pagination */}
            <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 border rounded ${page === p ? "bg-primary text-white" : ""
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}