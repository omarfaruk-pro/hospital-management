"use client";

import { useEffect, useState } from "react";
import { MdSearch, MdAdd, MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import TableSkeleton from "./TableSkeleton";
import { getPages } from "@/app/lib/pagination";
import Image from "next/image";
import { deleteDoctor, getAllDoctors } from "@/app/actions/doctor";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AllDoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const limit = 10;

    const [search, setSearch] = useState("");


    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            const res = await getAllDoctors();
            if (res.success) {
                setDoctors(res.doctors);
                setFiltered(res.doctors);
                setDisplayData(res.doctors.slice(0, limit));
            }
            setLoading(false);
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const searchFn = () => {
            const result = doctors.filter((d) =>
                d.name.toLowerCase().includes(search.toLowerCase())
            );
            setFiltered(result);
            setPage(1);
            setDisplayData(result.slice(0, limit));
        }
        searchFn();
    }, [search, doctors]);


    const handlePageChange = (p) => {
        setPage(p);
        const start = (p - 1) * limit;
        const end = start + limit;
        setDisplayData(filtered.slice(start, end));
    };

    const totalPages = Math.ceil(filtered.length / limit);



    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will lost this test permanently",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteDoctor(id);
                Swal.fire("Deleted!", res.message, "success");
                setDoctors(doctors.filter((t) => t._id !== id));
            }
        })
    }

    return (
        <div className="bg-bg min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-text">Doctors Gallery</h1>
                    </div>

                    <Link href="/manager/add-doctor" className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                        <MdAdd size={20} /> Add New Doctor
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 mb-6 flex items-center">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                        <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-bg border-2 border-transparent focus:border-primary/10 rounded-2xl outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Doctor</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Email</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Experience</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Designation</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <TableSkeleton />
                                ) : (
                                    displayData.map((doc) => (
                                        <tr key={doc._id} className="hover:bg-bg/30 transition-colors">

                                            {/* Doctor Info (Image + Name + Reg No) */}
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        src={doc.photoUrl}
                                                        alt={doc.name}
                                                        className="w-10 h-10 rounded-full object-cover border"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-text">{doc.name}</p>
                                                        <p className="text-xs text-gray-400">{doc.registrationNumber}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-5 text-gray-500 font-medium">
                                                {doc.email}
                                            </td>

                                            {/* Experience */}
                                            <td className="px-6 py-5 font-semibold text-text">
                                                {doc.experienceYears} yrs
                                            </td>

                                            {/* Designation */}
                                            <td className="px-6 py-5 text-gray-500">
                                                {doc.designation}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 text-xs rounded-full font-semibold 
                                            ${doc.status === "active"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"}`}>
                                                    {doc.status}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex gap-1 justify-end">
                                                <Link
                                                        href={`/doctors/${doc._id}`}
                                                        className="p-2 bg-blue-50 text-blue-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    >
                                                        <MdRemoveRedEye size={18} />
                                                    </Link>
                                                    <Link
                                                        href={`/manager/${doc._id}/edit-doctor`}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    >
                                                        <MdEdit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(doc._id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all "
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>


                    <div className="flex justify-between items-center px-6">
                        <p className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</p>
                        <div className="p-6 border-t border-gray-100 flex justify-center gap-2 flex-wrap bg-gray-50/30">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30 text-xs font-bold uppercase tracking-widest"
                            >
                                Prev
                            </button>

                            {getPages(totalPages, page).map((p, i) =>
                                p === "..." ? (
                                    <span key={`dots-${i}`} className="px-3 py-2 text-gray-400 font-bold">...</span>
                                ) : (
                                    <button
                                        key={`page-${p}-${i}`}
                                        onClick={() => handlePageChange(p)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === p ? "bg-primary text-white shadow-md" : "bg-white border border-transparent text-gray-500 hover:border-gray-200"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30 text-xs font-bold uppercase tracking-widest"
                            >
                                Next
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Total doctors: {doctors.length}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}




