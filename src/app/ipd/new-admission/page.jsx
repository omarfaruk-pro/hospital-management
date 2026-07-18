"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { TbLoader2 } from "react-icons/tb";
import Swal from "sweetalert2";

const accommodationTypes = [
    "cabin",
    "ward",
    "icu",
    "ccu",
    "nicu",
    "picu",
];

export default function AdmissionPage() {
    const [selectedType, setSelectedType] = useState("");
    const [selectedGender, setSelectedGender] = useState("common");

    const [beds, setBeds] = useState([]);
    const [selectedBed, setSelectedBed] = useState(null);

    const [loadingBeds, setLoadingBeds] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const router = useRouter();

    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        gender: "male",
        phone: "",
        address: "",
        bloodGroup: "",
        doctorName: "",
        diagnosis: "",
        emergencyName: "",
        emergencyPhone: "",
    });

    // fetch available beds
    useEffect(() => {
        if (!selectedType) {
            Swal.fire({
                icon: "info",
                title: "Select Accommodation Type",
                text: "Please select an accommodation type to view available beds.",
            });
            return;
        };

        const fetchBeds = async () => {
            try {
                setLoadingBeds(true);

                const res = await fetch(
                    `/api/beds/available?type=${selectedType}&gender=${selectedGender}`
                );

                const data = await res.json();

                setBeds(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingBeds(false);
            }
        };

        fetchBeds();
    }, [selectedType, selectedGender]);

    // reserve bed
    const handleReserveBed = async (bed) => {
        try {
            const res = await fetch("/api/beds/reserve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bedId: bed._id,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                return Swal.fire({
                    icon: "error",
                    title: "Bed Reservation Failed",
                    text: data.message,
                });
            }

            setSelectedBed(bed);

            setBeds((prev) =>
                prev.map((item) =>
                    item._id === bed._id
                        ? {
                            ...item,
                            status: "selected",
                        }
                        : item
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    // submit admission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!selectedBed) {
            setIsSubmitted(false);
            return Swal.fire({
                icon: "error",
                title: "No Bed Selected",
                text: "Please select a bed before submitting the admission form.",
            });
        }

        if(!formData.patientName || !formData.age || !formData.gender || !formData.phone || !formData.address || !formData.emergencyName || !formData.emergencyPhone) {
            setIsSubmitted(false);
            return Swal.fire({
                icon: "error",
                title: "Incomplete Form",
                text: "Please fill in all the required fields.",
            });
        }

        const payload = {
            ...formData,
            bedId: selectedBed._id,
        };

        const res = await fetch("/api/admissions/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
            setIsSubmitted(false);
            return Swal.fire({
                icon: "error",
                title: "Admission Failed",
                text: data.message,
            });
        }
        Swal.fire({
            icon: "success",
            title: "Admission Successful"
        });

        router.push(`/ipd/admission-success/${data.admissionId}`);

        console.log(payload);
        setIsSubmitted(false);

    };

    return (
        <div className="min-h-screen bg-bg p-6">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-3xl bg-white p-6 shadow-sm lg:col-span-2"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-text">
                            Patient Admission
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Fill patient information and assign accommodation.
                        </p>
                    </div>

                    {/* patient info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            label="Patient Name*"
                            value={formData.patientName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    patientName: e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Age*"
                            type="number"
                            value={formData.age}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    age: e.target.value,
                                })
                            }
                        />

                        {/* gender */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Gender*
                            </label>

                            <select
                                value={formData.gender}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        gender: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                            >
                                <option value="male">Male</option>

                                <option value="female">Female</option>

                                <option value="other">Other</option>
                            </select>
                        </div>

                        <InputField
                            label="Phone*"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Blood Group"
                            value={formData.bloodGroup}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bloodGroup: e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Doctor Name"
                            value={formData.doctorName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    doctorName: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* address */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Address*
                        </label>

                        <textarea
                            rows={3}
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                        />
                    </div>

                    {/* diagnosis */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Diagnosis / Problem
                        </label>

                        <textarea
                            rows={4}
                            value={formData.diagnosis}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    diagnosis: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                        />
                    </div>

                    {/* emergency */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            label="Emergency Contact Name*"
                            value={formData.emergencyName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    emergencyName: e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Emergency Contact Phone*"
                            value={formData.emergencyPhone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    emergencyPhone: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* submit */}
                    <button
                        disabled={isSubmitted}
                        className="flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:bg-secondary disabled:opacity-70"
                    >
                        {isSubmitted ? (
                            <TbLoader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Confirm Admission"
                        )}
                    </button>
                </form>

                {/* accommodation */}
                <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-text">
                            Accommodation
                        </h2>
                    </div>

                    {/* type */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Accommodation Type
                        </label>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                        >
                            <option value="">Select Type</option>

                            {accommodationTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* gender */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Gender Preference
                        </label>

                        <select
                            value={selectedGender}
                            onChange={(e) => {
                                setSelectedGender(e.target.value)
                                setBeds([])
                            }}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                        >
                            <option value="common">Common</option>

                            <option value="male">Male</option>

                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* beds */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">
                                Available Beds
                            </h3>

                            <span className="text-sm text-gray-500">
                                {beds.length} beds
                            </span>
                        </div>

                        {loadingBeds && (
                            <div className="flex items-center justify-center py-10">
                                <TbLoader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}

                        <div className="space-y-3">
                            {beds.map((bed) => (
                                <div
                                    key={bed._id}
                                    className={`rounded-2xl border p-4 transition ${selectedBed?._id === bed._id
                                        ? "border-primary bg-blue-50"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {bed.bedNumber}
                                            </h4>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {bed.unitName}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {bed.facilities?.map((item) => (
                                                    <span
                                                        key={item}
                                                        className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold text-primary">
                                                ৳ {bed.pricePerDay}
                                            </p>

                                            <button
                                                type="button"
                                                disabled={selectedBed?._id === bed._id}
                                                onClick={() => handleReserveBed(bed)}
                                                className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-secondary"
                                            >
                                                Select Bed
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!loadingBeds && beds.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 py-10 text-center text-gray-500">
                                No available beds found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({
    label,
    type = "text",
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />
        </div>
    );
}