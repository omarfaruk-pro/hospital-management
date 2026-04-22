'use client'

import { getReportForPatient } from "@/app/actions/reports";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack, MdCheckCircle, MdPictureAsPdf, MdUploadFile } from "react-icons/md";
import Swal from "sweetalert2";

export default function ReportDownloadPage() {
    const params = useParams();
    const id = params.id;
    const [reportData, setReportData] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getReport = async () => {
            setLoading(true);
            const res = await getReportForPatient(id);
            setReportData(res);
            setLoading(false);
        };
        getReport();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    if (reportData.paymentStatus !== "paid" || reportData.orderStatus !== "completed") {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "You must pay for the test first",
        })
        router.push("/my-all-tests");
        return null;
    }
    const report = reportData?.report || [];


    return (
        <>
            <section>
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 my-8">
                        <Link href="/my-all-tests" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                            <MdArrowBack size={24} className="text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-text">My all tests</h1>
                    </div>
                    {report.length > 0 ? (
                        report.map((item, i) => (
                            <a href={item} key={i} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-gray-100 hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-red-500">
                                        <MdPictureAsPdf size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-text truncate max-w-50 md:max-w-md">Report_Final_{i + 1}.pdf</span>
                                </div>
                                <MdCheckCircle className="text-green-500" size={20} />
                            </a>
                        ))
                    ) : (
                        <div className="py-10 border-2 border-dashed border-gray-50 rounded-3xl flex flex-col items-center text-gray-300">
                            <MdUploadFile size={40} className="mb-2" />
                            <p className="text-sm font-medium">No files uploaded yet</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
