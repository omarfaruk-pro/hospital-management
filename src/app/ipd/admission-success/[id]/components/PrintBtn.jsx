"use client";

import { BiPrinter } from "react-icons/bi";



export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-white transition hover:bg-blue-800"
        >
            <BiPrinter size={18} />

            Print Admission Slip
        </button>
    )
}