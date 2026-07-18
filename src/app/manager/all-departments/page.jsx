"use client";

import { useEffect, useState } from "react";
import { MdSearch, MdAdd, MdEdit, MdDelete } from "react-icons/md";
import TableSkeleton from "./TableSkeleton";
import Swal from "sweetalert2";
import { addDepartment, deleteDepartment, getAllDepartmentsForManager, updateDepartment } from "@/app/actions/departments";
import Link from "next/link";
import { IoMdEye } from "react-icons/io";
import PaginationUi from "@/app/component/Pagination-Ui";

export default function AllDepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const limit = 10;

    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        isActive: "",
    });

    useEffect(() => {
        const fetchdepartments = async () => {
            setLoading(true);
            const res = await getAllDepartmentsForManager();
            if (res.success) {
                setDepartments(res.departments);
                setFiltered(res.departments);
                setDisplayData(res.departments.slice(0, limit));
            }
            setLoading(false);
        };
        fetchdepartments();
    }, []);

    useEffect(() => {
        const searchFn = () => {
            const result = departments.filter((d) =>
                d.name.toLowerCase().includes(search.toLowerCase())
            );
            setFiltered(result);
            setPage(1);
            setDisplayData(result.slice(0, limit));
        }
        searchFn();
    }, [search, departments]);


    const handlePageChange = (p) => {
        setPage(p);
        const start = (p - 1) * limit;
        const end = start + limit;
        setDisplayData(filtered.slice(start, end));
    };

    const totalPages = Math.ceil(filtered.length / limit);


    const handleAdd = () => {
        setIsEdit(false);
        setForm({ name: "", slug: "", isActive: "" });
        setOpenModal(true);
    };

    const handleEdit = (dept) => {
        setIsEdit(true);
        setSelectedDepartment(dept);
        setForm({ name: dept.name, slug: dept.slug, isActive: dept.isActive });
        setOpenModal(true);
    };

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
                const res = await deleteDepartment(id);
                Swal.fire("Deleted!", res.message, "success");
                setDepartments(departments.filter((t) => t._id !== id));
            }
        })
    }


    const handleChange = (e) => {
        if (e.target.name === "name") {
            const slug = e.target.value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
            setForm({ ...form, name: e.target.value, slug });
            return;
        }
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        const isSlugTaken = departments.some((d) => d.slug === form.slug && (!isEdit || (isEdit && d._id !== selectedDepartment._id)));
        if (isSlugTaken) {
            Swal.fire({ icon: "error", title: "Error", text: "Slug already exists. Please add a number with (-)." });
            return;
        }

        const isNameTaken = departments.some((d) => d.name === form.name && (!isEdit || (isEdit && d._id !== selectedDepartment._id)));
        if (isNameTaken) {
            Swal.fire({ icon: "error", title: "Error", text: "Department already exists. Please choose another department name." });
            return;
        }

        if (!form.name || !form.slug) {
            Swal.fire({ icon: "error", title: "Error", text: "Please add both name and slug" });
            return;
        }

        if (isEdit) {
            const res = await updateDepartment(selectedDepartment._id, { name: form.name, slug: form.slug, isActive: form.isActive === "true" ? true : false });
            if (res.success) {
                Swal.fire({ icon: "success", title: "Department Updated", text: `${selectedDepartment.name} has been updated` });
                const updateddepartments = departments.map((t) => {
                    if (t._id === selectedDepartment._id) {
                        return { ...t, name: form.name, slug: form.slug, isActive: form.isActive === "true" ? true : false };
                    }
                    return t;
                });
                setDepartments(updateddepartments);
            }
        } else {
            const newDept = {
                name: form.name,
                slug: form.slug,
                isActive: form.isActive === "true" ? true : false,
            };
            const res = await addDepartment(newDept);
            if (!res.success) {
                Swal.fire({ icon: "error", title: "Error", text: res.message });
                return;
            }
            Swal.fire({ icon: "success", title: "Department Added", text: `${newDept.name} has been added` });
            const fetchdepartments = async () => {
                setLoading(true);
                const res = await getAllDepartmentsForManager();
                if (res.success) {
                    setDepartments(res.departments);
                    setFiltered(res.departments);
                    setDisplayData(res.departments.slice(0, limit));
                }
                setLoading(false);
            };
            fetchdepartments();
        }
        setOpenModal(false);
    };

    return (
        <div className="bg-bg min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-text">All Departments</h1>
                    </div>

                    <button onClick={handleAdd} className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                        <MdAdd size={20} /> Add New Department
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 mb-6 flex items-center">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                        <input
                            type="text"
                            placeholder="Search by department name..."
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
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Active</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <TableSkeleton />
                                ) : (
                                    displayData.map((d) => (
                                        <tr key={d._id} className="hover:bg-bg/30 transition-colors">
                                            <td className="px-8 py-5 font-bold text-text">{d.name}</td>

                                            <td className="px-6 py-5 text-gray-500">{d.isActive ? "Yes" : "No"}</td>
                                            <td className="px-8 py-5 text-right">
                                                <Link href={`/departments/${d.slug}`} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all inline-flex items-center">
                                                    <IoMdEye size={18} />
                                                </Link>
                                                <button onClick={() => handleEdit(d)} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all mx-2">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(d._id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                                    <MdDelete size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>


                    <PaginationUi page={page} totalPages={totalPages} handlePageChange={handlePageChange} departments={departments} />
                </div>
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-text/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white">
                        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                            <h2 className="text-xl font-black text-text">
                                {isEdit ? "Update Department" : "Register New Department"}
                            </h2>
                        </div>

                        <div className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Department Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Radiology & Imaging"
                                    className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Slug</label>
                                <input
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="radiology-imaging"
                                    className="w-full p-4 bg-bg rounded-2xl outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Is Active</label>
                                <select
                                    name="isActive"
                                    value={form.isActive}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-bg rounded-2xl outline-none"
                                >
                                    <option value="">Select Status</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>


                        <div className="p-8 pt-0 flex gap-3">
                            <button
                                onClick={() => (
                                    setOpenModal(false),
                                    setIsEdit(false),
                                    setForm({
                                        name: "",
                                        slug: "",
                                        isActive: "",
                                    }),
                                    setSelectedDepartment(null)
                                )}
                                className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-text transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-2 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100"
                            >
                                {isEdit ? "Apply Changes" : "Save Test"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




