"use client";
import { createPatient, findPatientById } from "@/app/actions/patients";
import { createOrder, getAllTests } from "@/app/actions/tests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function LabOrderPage() {
    const router = useRouter();
    const [patient, setPatient] = useState({
        id: "",
        name: "",
        phone: "",
        gender: "",
        dob: "",
    });
    const [patientId, setPatientId] = useState("");

    const [isNew, setIsNew] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paidAmount, setPaidAmount] = useState(0);


    const [loading, setLoading] = useState({
        patient: false,
        create: false,
        tests: false,
    });

    const [search, setSearch] = useState("");

    const [allTests, setAllTests] = useState([]);
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

    const [discount, setDiscount] = useState(0);

    const [selectedTests, setSelectedTests] = useState([]);


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
    const dueAmount = paymentStatus === "partial" ? (total - paidAmount).toFixed(0) : paymentStatus === "unpaid" ? total : 0;

    const getPatient = async () => {
        setLoading((prev) => ({ ...prev, patient: true }));
        const res = await findPatientById(patientId);
        setLoading((prev) => ({ ...prev, patient: false }));
        if (res.success) {
            setPatient(res.data);
            setPatientId(res.data.id);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: res.message,
            });
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
            Swal.fire({
                icon: "success",
                title: "Patient Created",
                text: `Patient ID: ${res.data.id}`,
            });
            setPatient(res.data);
            setPatientId(res.data.id);
            setIsNew(false);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: res.message,
            });
        }
    };

    const handleDiscount = (e) => {
        const value = Math.min(100, Math.max(0, Number(e.target.value)));
        setDiscount(value);
    };

    const handleTestOrderCreate = async () => {
        if (!patientId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please add patient information first",
            });
            return;
        }
        if (selectedTests.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select at least one test",
            });
            return;
        }
        if (!paymentStatus) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select payment status",
            });
            return;
        }

        const payload = {
            patientId,

            testsIds: selectedTests.map(t => t._id),

            testDetails: selectedTests.map(t => ({
                name: t.name,
                price: t.price
            })),

            subTotal,
            discountPercent: discount,
            discountAmount,
            total,

            paymentStatus,
            paidAmount,
            dueAmount,

            orderStatus: "processing",

            doctorId: null,
            createdBy: null,

            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const res = await createOrder(payload);
        if (res.success) {
            Swal.fire({
                icon: "success",
                title: "Order Created",
                text: `Order ID: ${res?.orderId}`,
            });
            router.push(`/test/${res.insertedId}/view`);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: res.message,
            });
        }

    }


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center gap-3 w-36 justify-between">
                <span className="text-sm font-medium">
                    {isNew ? "New" : "Old"} Patient
                </span>

                <button
                    onClick={() => setIsNew(!isNew)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition ${isNew ? "bg-green-500" : "bg-gray-400"
                        }`}
                >
                    <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${isNew ? "translate-x-6" : "translate-x-0"
                            }`}
                    />
                </button>
            </div>
            {/* Patient Info */}
            <form onSubmit={handlePatientAdd} className="bg-white p-4 rounded-xl shadow mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold mb-4">Patient Info</h2>
                    <button type="button" onClick={() => {
                        setPatient({ name: "", phone: "", gender: "", dob: "" });
                        setPatientId("");
                    }}>
                        Clear
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    <div>
                        <input onChange={(e) => setPatientId(e.target.value)} name="patientId" className="p-2 border rounded" value={patientId} readOnly={isNew} placeholder="Patient Id" />
                        {
                            !isNew && (<button disabled={loading.patient} type="button" onClick={getPatient} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {loading.patient ? "Loading..." : "Find"}
                            </button>)
                        }
                    </div>
                    <input name="name" className="p-2 border rounded" onChange={(e) => setPatient({ ...patient, name: e.target.value })} value={patient.name} placeholder="Patient Name" readOnly={!isNew} />
                    <input name="phone" className="p-2 border rounded" onChange={(e) => setPatient({ ...patient, phone: e.target.value })} value={patient.phone} placeholder="Phone Number" readOnly={!isNew} />
                    <select name="gender" className="p-2 border rounded" onChange={(e) => setPatient({ ...patient, gender: e.target.value })} value={patient.gender} readOnly={!isNew}>
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input type="date" className="p-2 border rounded" onChange={(e) => setPatient({ ...patient, dob: e.target.value })} value={patient.dob} readOnly={!isNew} name="dob" />
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Create
                    </button>
                </div>
                <div className="flex items-center gap-10  mt-4">
                    <input type="number" placeholder="Discount %" onChange={(e) => handleDiscount(e)} className="p-2 border rounded w-70" min={0} max={100} />
                    <select onChange={(e) => setPaymentStatus(e.target.value)} className="p-2 border rounded" value={paymentStatus}>
                        <option value="" disabled>Payment Status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                    </select>
                    {
                        paymentStatus === "partial" && (
                            <input type="number" onChange={(e) => setPaidAmount(Number(e.target.value))} value={paidAmount} placeholder="Paid Amount" className="p-2 border rounded w-70" min={0} max={total} />
                        )
                    }
                </div>

            </form>

            <div className="grid grid-cols-12 gap-6">
                {/* Invoice Section */}
                <div className="col-span-7 bg-white p-4 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Invoice</h2>

                    {selectedTests.map((test) => (
                        <div key={test._id} className="flex justify-between items-center border-b py-2">
                            <span>{test.name}</span>
                            <div className="flex items-center gap-4">
                                <span>{test.price}৳</span>
                                <button
                                    onClick={() => removeTest(test._id)}
                                    className="text-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between max-w-sm ml-auto">
                            <span className="font-bold">Sub Total:</span>
                            <span>{subTotal}৳</span>
                        </div>
                        <div className="flex justify-between max-w-sm ml-auto">
                            <span className="font-bold">Discount: {discount}%</span>
                            <span>{discountAmount}৳</span>
                        </div>
                        <div className="flex justify-between max-w-sm ml-auto">
                            <span className="font-bold">Total:</span>
                            <span>{total}৳</span>
                        </div>
                        {
                            paymentStatus === "partial" && (
                                <div className="flex justify-between max-w-sm ml-auto">
                                    <span className="font-bold">Paid Amount:</span>
                                    <span>{paidAmount}৳</span>
                                </div>
                            )
                        }
                        {
                            paymentStatus === "paid" && (
                                <div className="flex justify-between max-w-sm ml-auto">
                                    <span className="font-bold">Paid Amount:</span>
                                    <span>{total}৳</span>
                                </div>
                            )
                        }
                        {
                            paymentStatus === "unpaid" && (
                                <div className="flex justify-between max-w-sm ml-auto">
                                    <span className="font-bold">Paid Amount:</span>
                                    <span>{paidAmount}৳</span>
                                </div>
                            )
                        }
                        <div className="flex justify-between max-w-sm ml-auto">
                            <span className="font-bold">Due Amount:</span>
                            <span>{dueAmount}৳</span>
                        </div>
                    </div>

                    <div className="flex justify-center mt-10">
                        <button onClick={handleTestOrderCreate} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            Generate Invoice
                        </button>
                    </div>
                </div>

                {/* Test Search */}
                <div className="col-span-5 bg-white p-4 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Add Tests</h2>

                    <input
                        type="search"
                        placeholder="Search test..."
                        className="w-full p-2 border rounded mb-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="space-y-2">
                        {filteredTests.slice(0, 10).map((test) => (
                            <div
                                key={test._id}
                                className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                onClick={() => addTest(test)}
                            >
                                <span>{test.name}</span>
                                <span>{test.price}৳</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
