"use client";
import Link from 'next/link';
import { MdPrint, MdLocalHospital, MdPerson, MdReceipt, MdPayment, MdEdit, MdAdd } from 'react-icons/md';

export default function Invoice({ data, orderId }) {
    const order = data.order;

    const age =
        new Date().getFullYear() -
        new Date(order.patient.dob).getFullYear();

    const subtotal =
        order.subtotal ??
        order.testDetails.reduce((sum, t) => sum + t.price, 0);

    const total = Number(order.total);
    const due = Number(order.dueAmount);

    return (
        <section className="bg-bg py-10 min-h-screen print:bg-white print:py-0 print:m-0">
            {/* Print-specific CSS to force background colors and remove default browser headers/footers */}
            <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide the default URL/Date headers from browser */
          header, footer, .header, .footer { display: none !important; }
        }
      `}</style>

            <div className="container mx-auto px-4 max-w-4xl print:max-w-full print:px-0">

                {/* Main Invoice Card */}
                <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none">

                    {/* Header Accent Bar */}
                    <div className="h-2 bg-primary w-full" />

                    <div className="p-8 md:p-12 print:p-4">
                        {/* Hospital Branding */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary p-3 rounded-2xl text-white print:bg-primary print:text-white">
                                    <MdLocalHospital size={40} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-text uppercase tracking-tight">
                                        Holy Care <span className="text-primary">Diagnostic</span>
                                    </h1>
                                    <p className="text-gray-500 text-sm font-medium">Chattogram, Bangladesh</p>
                                    <p className="text-gray-500 text-xs">Emergency: 01XXXXXXXXX</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-black text-gray-100 uppercase mb-1 print:text-gray-200">Invoice</h2>
                                <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase">No:</span>
                                    <span className="text-sm font-black text-secondary">{order.orderId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            {/* Patient Details */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest border-b border-primary/10 pb-2">
                                    <MdPerson size={18} /> Patient Information
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-[13px]">
                                    <span className="text-gray-400">Name:</span>
                                    <span className="text-text font-bold">{order.patient.name}</span>

                                    <span className="text-gray-400">Patient ID:</span>
                                    <span className="text-text font-medium">{order.patientId}</span>

                                    <span className="text-gray-400">Age / Gender:</span>
                                    <span className="text-text font-medium capitalize">{age}Y / {order.patient.gender}</span>

                                    <span className="text-gray-400">Contact:</span>
                                    <span className="text-text font-medium">{order.patient.phone}</span>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest border-b border-secondary/10 pb-2">
                                    <MdReceipt size={18} /> Billing Details
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-[13px]">
                                    <span className="text-gray-400">Bill Date:</span>
                                    <span className="text-text font-medium">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>

                                    <span className="text-gray-400">Order Status:</span>
                                    <span>
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100 print:bg-blue-50">
                                            {order.orderStatus}
                                        </span>
                                    </span>

                                    <span className="text-gray-400">Payment Status:</span>
                                    <span className={`font-bold uppercase text-[11px] ${order.paymentStatus === 'unpaid' ? 'text-red-500' : 'text-green-500'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Test Table */}
                        <div className="mb-10 overflow-hidden border border-gray-100 rounded-2xl print:rounded-none">
                            <table className="w-full text-[13px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 print:bg-gray-50">
                                        <th className="p-3 text-left font-bold text-gray-400 w-12">#</th>
                                        <th className="p-3 text-left font-bold text-gray-400">Investigation Name</th>
                                        <th className="p-3 text-right font-bold text-gray-400">Price (৳)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.testDetails.map((test, i) => (
                                        <tr key={i}>
                                            <td className="p-3 text-gray-500 font-medium">{String(i + 1).padStart(2, '0')}</td>
                                            <td className="p-3 font-bold text-text">{test.name}</td>
                                            <td className="p-3 text-right font-black text-secondary">{test.price.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Area */}
                        <div className="grid grid-cols-2 gap-10">
                            {/* Instructions */}
                            <div className="space-y-4">
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 print:bg-blue-50/30">
                                    <p className="text-[10px] font-bold text-primary uppercase mb-2">Instructions:</p>
                                    <ul className="text-[10px] text-gray-500 space-y-1 list-disc pl-4">
                                        <li>Please bring this invoice for report collection.</li>
                                        <li>Reports available within 24-48 hours.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Calculations */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-bold text-text">৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-green-600">
                                    <span>Discount</span>
                                    <span className="font-bold">- ৳{order.discountAmount}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center">
                                    <span className="text-text font-black uppercase text-[10px]">Total</span>
                                    <span className="text-xl font-black text-primary">৳{total.toLocaleString()}</span>
                                </div>
                                <div className="bg-red-50 p-2 rounded-lg flex justify-between items-center text-red-600 print:bg-red-50">
                                    <span className="text-[10px] font-black uppercase">Due</span>
                                    <span className="text-md font-black">৳{due.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Signature Area */}
                        <div className="mt-12 flex justify-between items-end border-t border-gray-100 pt-8">
                            <div className="text-center">
                                <div className="w-24 border-b border-gray-300 mb-1 mx-auto" />
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Patient</p>
                            </div>
                            <div className="text-center">
                                <div className="w-32 border-b-2 border-primary mb-1 mx-auto" />
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Authorized Officer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Button Wrapper */}
                <div className="mt-8 flex justify-center print:hidden gap-5">

                    <Link href={`/test/entry`} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-300 transition-all shadow-lg "><MdAdd size={20} /> Create </Link>

                    <Link href={`/test`} className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-400 transition-all shadow-lg ">
                        <MdPayment size={20} /> All Tests
                    </Link>
                    
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg"
                    >
                        <MdPrint size={20} /> Print Invoice
                    </button>
                </div>
            </div>
        </section>
    );
}