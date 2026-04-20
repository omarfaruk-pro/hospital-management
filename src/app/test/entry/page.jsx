"use client";
import { createPatient, findPatientById } from "@/app/actions/patients";
import { createOrder, getAllTests } from "@/app/actions/tests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    MdPersonAdd, MdSearch, MdOutlineReceiptLong,
    MdAddCircleOutline, MdClose, MdPayments, MdPersonSearch
} from "react-icons/md";

export default function LabOrderPage() {
    const router = useRouter();
    const [patient, setPatient] = useState({ id: "", name: "", phone: "", gender: "", dob: "" });
    const [patientId, setPatientId] = useState("P-");
    const [isNew, setIsNew] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paidAmount, setPaidAmount] = useState(0);
    const [loading, setLoading] = useState({ patient: false, create: false, tests: false });
    const [search, setSearch] = useState("");
    const [allTests, setAllTests] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [selectedTests, setSelectedTests] = useState([]);

    useEffect(() => {
        const getTests = async () => {
            setLoading((prev) => ({ ...prev, tests: true }));
            const res = await getAllTests();
            if (res.success) {
                setAllTests(res.tests);
                setLoading((prev) => ({ ...prev, tests: false }));
            }
        };
        getTests();
    }, []);

    const filteredTests = allTests.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())) || allTests;

    const addTest = (test) => {
        if (!selectedTests.find((t) => t._id === test._id)) {
            setSelectedTests((prev) => [...prev, test]);
        }
    };

    const removeTest = (id) => {
        setSelectedTests((prev) => prev.filter((t) => t._id !== id));
    };

    const subTotal = selectedTests.reduce((sum, t) => sum + t.price, 0);
    const discountAmount = (subTotal * discount) / 100;
    const total = (subTotal - discountAmount).toFixed(0);
    const dueAmount = paymentStatus === "partial" ? (Number(total) - paidAmount).toFixed(0) : paymentStatus === "unpaid" ? total : 0;

    const getPatient = async () => {
        setLoading((prev) => ({ ...prev, patient: true }));
        const res = await findPatientById(patientId);
        setLoading((prev) => ({ ...prev, patient: false }));
        if (res.success) {
            setPatient(res.data);
            setPatientId(res.data.id);
        } else {
            Swal.fire({ icon: "error", title: "Error", text: res.message });
        }
    };

    const handlePatientAdd = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newPatient = {
            name: form.name.value,
            phone: form.phone.value,
            gender: form.gender.value,
            dob: form.dob.value,
        };
        const res = await createPatient(newPatient);
        if (res.success) {
            Swal.fire({ icon: "success", title: "Patient Created", text: `ID: ${res.data.id}` });
            setPatient(res.data);
            setPatientId(res.data.id);
            setIsNew(false);
        } else {
            Swal.fire({ icon: "error", title: "Error", text: res.message });
        }
    };

    const handleTestOrderCreate = async () => {
        if (!patientId) return Swal.fire({ icon: "error", title: "Error", text: "Please add patient information first" });
        if (selectedTests.length === 0) return Swal.fire({ icon: "error", title: "Error", text: "Please select at least one test" });
        if (!paymentStatus) return Swal.fire({ icon: "error", title: "Error", text: "Please select payment status" });

        const payload = {
            patientId,
            testsIds: selectedTests.map(t => t._id),
            testDetails: selectedTests.map(t => ({ name: t.name, price: t.price })),
            subTotal,
            discountPercent: discount,
            discountAmount,
            total,
            paymentStatus,
            paidAmount,
            dueAmount,
            orderStatus: "pending",
            doctorId: null,
            createdBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const res = await createOrder(payload);
        if (res.success) {
            Swal.fire({ icon: "success", title: "Order Created", text: `Order ID: ${res?.orderId}` });
            router.push(`/test/${res.insertedId}/view`);
        }
    };

    return (
        <div className="bg-bg min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

                {/* --- Left Column: Patient & Billing --- */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* Patient Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black text-text flex items-center gap-2">
                                <MdPersonAdd className="text-primary" /> Patient Details
                            </h2>

                            <div className="flex items-center gap-3">
                                {/* --- RESTORED CLEAR FUNCTIONALITY --- */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPatient({ name: "", phone: "", gender: "", dob: "" });
                                        setPatientId("");
                                        setIsNew(true);
                                    }}
                                    className="text-[10px] font-bold uppercase text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                >
                                    <MdClose size={14} /> Clear
                                </button>

                                <div className="flex items-center gap-2 bg-bg p-1 rounded-full px-2">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">{isNew ? "New" : "Existing"}</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsNew(!isNew)}
                                        className={`w-10 h-5 flex items-center rounded-full p-1 transition ${isNew ? "bg-primary" : "bg-gray-300"}`}
                                    >
                                        <div className={`bg-white w-3 h-3 rounded-full shadow transition-transform ${isNew ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePatientAdd} className="space-y-4">
                            {!isNew ? (
                                <div className="flex gap-2">
                                    <input
                                        onChange={(e) => setPatientId(e.target.value)}
                                        value={patientId}
                                        className="flex-1 p-3 bg-bg border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Enter Patient ID"
                                    />
                                    <button
                                        type="button"
                                        onClick={getPatient}
                                        disabled={loading.patient}
                                        className="bg-secondary text-white p-3 rounded-xl hover:opacity-90 transition-all"
                                    >
                                        <MdPersonSearch size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-[10px] font-bold text-primary bg-blue-50 px-3 py-1 rounded-md mb-2 uppercase tracking-widest italic">
                                    Registration Mode
                                </div>
                            )}

                            <input
                                name="name"
                                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                                value={patient.name}
                                className="w-full p-3 bg-bg border-none rounded-xl text-sm outline-none read-only:opacity-60"
                                placeholder="Full Name"
                                readOnly={!isNew}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    name="phone"
                                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                                    value={patient.phone}
                                    className="w-full p-3 bg-bg border-none rounded-xl text-sm outline-none read-only:opacity-60"
                                    placeholder="Phone"
                                    readOnly={!isNew}
                                />
                                <select
                                    name="gender"
                                    onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                                    value={patient.gender}
                                    className="w-full p-3 bg-bg border-none rounded-xl text-sm outline-none"
                                    disabled={!isNew}
                                >
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <input
                                type="date"
                                name="dob"
                                onChange={(e) => setPatient({ ...patient, dob: e.target.value })}
                                value={patient.dob}
                                className="w-full p-3 bg-bg border-none rounded-xl text-sm outline-none"
                                readOnly={!isNew}
                            />

                            {isNew && (
                                <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-100 transform active:scale-95 transition-all">
                                    Register Patient
                                </button>
                            )}
                        </form>
                    </div>


                    {/* Billing Config Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-black text-text flex items-center gap-2 mb-6">
                            <MdPayments className="text-secondary" /> Payment Setup
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Discount (%)</label>
                                <input
                                    type="number"
                                    onChange={(e) => setDiscount(Math.min(100, Number(e.target.value)))}
                                    className="w-full p-3 bg-bg border-none rounded-xl text-sm outline-none"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Payment Status</label>
                                <select
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    value={paymentStatus}
                                    className="w-full p-3 bg-bg border-none rounded-xl text-sm outline-none font-bold text-secondary"
                                >
                                    <option value="" disabled>Choose Status</option>
                                    <option value="paid">Full Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="partial">Partial Payment</option>
                                </select>
                            </div>

                            {paymentStatus === "partial" && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black uppercase text-red-400 ml-1 mb-1 block">Collect Amount (৳)</label>
                                    <input
                                        type="number"
                                        onChange={(e) => setPaidAmount(Number(e.target.value))}
                                        value={paidAmount}
                                        className="w-full p-3 bg-red-50 border border-red-100 rounded-xl text-sm outline-none font-bold text-red-600"
                                        placeholder="0"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Invoice & Search --- */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                    {/* Test Search Bar */}
                    <div className="relative">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input
                            type="search"
                            placeholder="Search available tests (e.g. CBC, Lipid Profile...)"
                            className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-primary/10 transition-all text-lg font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                                {filteredTests.slice(0, 8).map((test) => (
                                    <div
                                        key={test._id}
                                        className="flex justify-between items-center p-4 hover:bg-bg cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                                        onClick={() => { addTest(test); setSearch(""); }}
                                    >
                                        <span className="font-bold text-text">{test.name}</span>
                                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-sm font-black">৳{test.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Invoice Display */}
                    <div className="bg-white rounded-4xl shadow-sm border border-gray-100 flex flex-col min-h-125">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-text flex items-center gap-3">
                                <MdOutlineReceiptLong className="text-primary" size={28} />
                                Order Summary
                            </h2>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {selectedTests.length} Items Selected
                            </span>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto max-h-100 space-y-4">
                            {selectedTests.length > 0 ? selectedTests.map((test) => (
                                <div key={test._id} className="flex justify-between items-center p-4 bg-bg rounded-2xl group transition-all hover:bg-gray-100">
                                    <div>
                                        <p className="font-bold text-text">{test.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Diagnostic Test</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-black text-secondary">৳{test.price}</span>
                                        <button onClick={() => removeTest(test._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <MdClose size={20} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                                    <MdAddCircleOutline size={64} className="opacity-20" />
                                    <p className="font-medium">No tests added yet. Search above to begin.</p>
                                </div>
                            )}
                        </div>

                        {/* Totals Footer */}
                        <div className="p-8 bg-gray-50/50 rounded-b-4xl border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-bold">৳{subTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discount}%)</span>
                                        <span className="font-bold">-৳{discountAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500 pt-2 border-t border-gray-200">
                                        <span className="font-bold uppercase text-[10px]">Net Payable</span>
                                        <span className="text-2xl font-black">৳{total}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Current Due</span>
                                        <span className="text-lg font-black text-red-600">৳{dueAmount}</span>
                                    </div>
                                    <button
                                        onClick={handleTestOrderCreate}
                                        disabled={selectedTests.length === 0}
                                        className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        Generate Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}