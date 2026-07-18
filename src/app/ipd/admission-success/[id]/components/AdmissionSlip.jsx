import Section from "./Section";
import InfoRow from "./InfoRow";

export default function AdmissionSlip({ data }) {
    const {
        patientName,
        age,
        gender,
        phone,
        address,
        bloodGroup,
        doctorName,
        diagnosis,
        admittedAt,
        status,
        emergencyContact,
        bed,
    } = data;

    return (
        <div
           
            className="mx-auto w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-xl print:shadow-none"
        >
            {/* ================= Header ================= */}

            <div className="border-b-4 border-blue-700 px-10 py-8">
                <div className="flex justify-between items-start">

                    <div className="flex gap-5">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-700 text-3xl font-bold text-blue-700">
                            H
                        </div>

                        <div>

                            <h1 className="text-3xl font-bold tracking-wide text-blue-700">
                                ABC Hospital & Diagnostic Center
                            </h1>

                            <p className="text-sm text-slate-500 mt-1">
                                123 Hospital Road, Dhaka, Bangladesh
                            </p>

                            <p className="text-sm text-slate-500">
                                Phone : +8801XXXXXXXXX
                            </p>

                            <p className="text-sm text-slate-500">
                                Email : info@abchospital.com
                            </p>

                        </div>

                    </div>

                    <div className="text-right">

                        <p className="text-sm uppercase text-slate-500">
                            IPD
                        </p>

                        <h2 className="text-2xl font-bold">
                            Admission Slip
                        </h2>

                        <span
                            className={`mt-3 inline-block rounded-full px-5 py-1 text-sm font-semibold
                            ${
                                status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {status?.toUpperCase()}
                        </span>

                    </div>

                </div>
            </div>

            {/* ================= Admission Summary ================= */}

            <div className="grid grid-cols-3 gap-5 bg-slate-50 px-10 py-5 border-b">

                <InfoRow
                    label="Admission Date"
                    value={new Date(admittedAt).toLocaleDateString()}
                />

                <InfoRow
                    label="Admission Time"
                    value={new Date(admittedAt).toLocaleTimeString()}
                />

                <InfoRow
                    label="Admission ID"
                    value={data._id}
                />

            </div>

            {/* ================= Patient ================= */}

            <Section title="Patient Information">

                <div className="grid grid-cols-2 gap-x-12 gap-y-4">

                    <InfoRow
                        label="Patient Name"
                        value={patientName}
                    />

                    <InfoRow
                        label="Phone"
                        value={phone}
                    />

                    <InfoRow
                        label="Age"
                        value={`${age} Years`}
                    />

                    <InfoRow
                        label="Gender"
                        value={gender}
                    />

                    <InfoRow
                        label="Blood Group"
                        value={bloodGroup}
                    />

                    <InfoRow
                        label="Address"
                        value={address}
                    />

                </div>

            </Section>

            {/* ================= Admission ================= */}

            <Section title="Admission Information">

                <div className="grid grid-cols-2 gap-x-12 gap-y-4">

                    <InfoRow
                        label="Consultant Doctor"
                        value={doctorName}
                    />

                    <InfoRow
                        label="Diagnosis"
                        value={diagnosis}
                    />

                </div>

            </Section>

            {/* ================= Bed ================= */}

            <Section title="Bed Information">

                <div className="grid grid-cols-3 gap-x-12 gap-y-4">

                    <InfoRow
                        label="Ward / Unit"
                        value={bed?.unitCode}
                    />

                    <InfoRow
                        label="Bed Number"
                        value={bed?.bedNumber}
                    />

                    <InfoRow
                        label="Daily Charge"
                        value={`৳ ${bed?.pricePerDay}`}
                    />

                </div>

            </Section>

            {/* ================= Emergency ================= */}

            <Section title="Emergency Contact">

                <div className="grid grid-cols-2 gap-x-12 gap-y-4">

                    <InfoRow
                        label="Guardian Name"
                        value={emergencyContact?.name}
                    />

                    <InfoRow
                        label="Phone"
                        value={emergencyContact?.phone}
                    />

                </div>

            </Section>

            {/* ================= Instructions ================= */}

            <div className="mx-10 mt-10 rounded-xl border border-blue-200 bg-blue-50 p-5">

                <h3 className="font-bold text-blue-700">
                    Important Instructions
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-600">

                    <li>
                        Please keep this admission slip carefully.
                    </li>

                    <li>
                        Show this slip during billing & medicine collection.
                    </li>

                    <li>
                        Inform reception immediately if patient changes bed.
                    </li>

                    <li>
                        Visiting Hours : 4:00 PM - 8:00 PM
                    </li>

                    <li>
                        This is a computer generated admission slip.
                    </li>

                </ul>

            </div>

            {/* ================= Footer ================= */}

            <div className="mt-20 grid grid-cols-3 gap-10 px-10 pb-5">

                <div className="text-center">

                    <div className="h-16 border-b"></div>

                    <p className="mt-3 font-medium">
                        Admission Officer
                    </p>

                </div>

                <div className="text-center">

                    <div className="h-16 border-b"></div>

                    <p className="mt-3 font-medium">
                        Patient / Guardian
                    </p>

                </div>

                <div className="text-center">

                    <div className="h-16 border-b"></div>

                    <p className="mt-3 font-medium">
                        Hospital Seal
                    </p>

                </div>

            </div>

            <div className=" flex justify-between px-10 pb-5">
                <p>Print Date: </p>
                <p>{new Date().toDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>

        </div>
    );
}