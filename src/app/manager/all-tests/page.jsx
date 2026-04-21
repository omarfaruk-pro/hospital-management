"use client";

import { useEffect, useState } from "react";
import { addNewTest, deleteTest, getAllTests, updateTest } from "@/app/actions/tests";
import { MdSearch, MdAdd, MdEdit, MdAccessTime, MdCategory, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDelete } from "react-icons/md";
import TableSkeleton from "./TableSkeleton";
import { getPages } from "@/app/lib/pagination";
import Swal from "sweetalert2";

export default function AllTestsPage() {
    const [tests, setTests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const limit = 10;

    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        reportTime: "",
    });

    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            const res = await getAllTests();
            if (res.success) {
                setTests(res.tests);
                setFiltered(res.tests);
                setDisplayData(res.tests.slice(0, limit));
            }
            setLoading(false);
        };
        fetchTests();
    }, []);

    useEffect(() => {
        const searchFn = () => {
            const result = tests.filter((t) =>
                t.name.toLowerCase().includes(search.toLowerCase())
            );
            setFiltered(result);
            setPage(1);
            setDisplayData(result.slice(0, limit));
        }
        searchFn();
    }, [search, tests]);


    const handlePageChange = (p) => {
        setPage(p);
        const start = (p - 1) * limit;
        const end = start + limit;
        setDisplayData(filtered.slice(start, end));
    };

    const totalPages = Math.ceil(filtered.length / limit);


    const handleAdd = () => {
        setIsEdit(false);
        setForm({ name: "", category: "", price: "", reportTime: "" });
        setOpenModal(true);
    };

    const handleEdit = (test) => {
        setIsEdit(true);
        setSelectedTest(test);
        setForm({ name: test.name, price: test.price, category: test.category, reportTime: test.reportTime });
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
                const res = await deleteTest(id);
                Swal.fire("Deleted!", res.message, "success");
                setTests(tests.filter((t) => t._id !== id));
            }
        })
    }


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        if (isEdit) {
            const res = await updateTest(selectedTest._id, { name: form.name, price: Number(form.price) });
            if (res.success) {
                Swal.fire({ icon: "success", title: "Test Updated", text: `${selectedTest.name} has been updated` });
                const updatedTests = tests.map((t) => {
                    if (t._id === selectedTest._id) {
                        return { ...t, name: form.name, price: Number(form.price) };
                    }
                    return t;
                });
                setTests(updatedTests);
            }
        } else {
            const newTest = {
                name: form.name,
                category: form.category,
                price: Number(form.price),
                reportTime: form.reportTime,
            };
            const res = await addNewTest(newTest);
            if (!res.success) {
                Swal.fire({ icon: "error", title: "Error", text: res.message });
                return;
            }
            Swal.fire({ icon: "success", title: "Test Added", text: `${newTest.name} has been added` });
            setTests([newTest, ...tests]);
        }
        setOpenModal(false);
    };

    return (
        <div className="bg-bg min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-text">Test Inventory</h1>
                    </div>

                    <button onClick={handleAdd} className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                        <MdAdd size={20} /> Add New Test
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 mb-6 flex items-center">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                        <input
                            type="text"
                            placeholder="Search by test name..."
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
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Report Time</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <TableSkeleton />
                                ) : (
                                    displayData.map((t) => (
                                        <tr key={t._id} className="hover:bg-bg/30 transition-colors">
                                            <td className="px-8 py-5 font-bold text-text">{t.name}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{t.category}</td>
                                            <td className="px-6 py-5 font-black text-text">৳{t.price}</td>
                                            <td className="px-6 py-5 text-gray-500">{t.reportTime}</td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => handleEdit(t)} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(t._id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all ml-2">
                                                    <MdDelete size={18} />
                                                </button>
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
                        <p className="text-sm text-gray-500 font-medium">Total Tests: {tests.length}</p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-text/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white">
                        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                            <h2 className="text-xl font-black text-text">
                                {isEdit ? "Update Test Details" : "Register New Test"}
                            </h2>
                        </div>

                        <div className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Test Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Blood Glucose"
                                    className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold"
                                />
                            </div>


                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="Hematology"
                                        className="w-full p-4 bg-bg rounded-2xl outline-none"
                                        readOnly={isEdit}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Report Time</label>
                                    <input
                                        name="reportTime"
                                        value={form.reportTime}
                                        onChange={handleChange}
                                        placeholder="12 Hours"
                                        className="w-full p-4 bg-bg rounded-2xl outline-none"
                                        readOnly={isEdit}
                                    />
                                </div>
                            </div>


                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Test Price (৳)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full p-4 bg-bg rounded-2xl outline-none font-black text-lg text-primary"
                                />
                            </div>
                        </div>

                        <div className="p-8 pt-0 flex gap-3">
                            <button
                                onClick={() => (
                                    setOpenModal(false),
                                    setIsEdit(false),
                                    setForm({
                                        name: "",
                                        category: "",
                                        reportTime: "",
                                        price: "",
                                    }),
                                    setSelectedTest(null)
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




