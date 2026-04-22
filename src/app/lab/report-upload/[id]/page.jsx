"use client";
import { getReportAction, reportUploadAction } from "@/app/actions/reports";
import { findOrderById, updateTestOrderStatus } from "@/app/actions/tests";
import { handleUpload } from "@/app/lib/handleCloudinaryUpload";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack, MdPerson, MdUploadFile, MdPictureAsPdf, MdCheckCircle } from "react-icons/md";
import Swal from "sweetalert2";

export default function ReportUpload() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedReport, setUploadedReport] = useState([]);
  const [allReportCompleted, setAllReportCompleted] = useState(false);
  const [loadFile, setLoadFile] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      const res = await findOrderById(orderId);
      setOrder(res.order);
      if (res.order.orderStatus === 'completed') setAllReportCompleted(true);
      setLoading(false);
    };
    getOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      const reportFn = async () => {
        const res = await getReportAction(order.orderId);
        if (!res) return;
        setUploadedReport(res?.report);
      }
      reportFn();
    }
  }, [order])

  const handlePdf = async (e) => {
    setLoadFile(true);
    const res = await handleUpload(e);
    setUploadedReport([...uploadedReport, res.url]);
    setLoadFile(false);
  }

  const reportUploadOnDB = async () => {
    if (uploadedReport.length === 0) {
      Swal.fire({ icon: "error", title: "Error!", text: "Please upload report" });
      return;
    }
    const payload = {
      orderId: order.orderId,
      patientId: order.patientId,
      report: uploadedReport,
      uploadDate: new Date(),
      updateDate: new Date()
    }
    const res = await reportUploadAction(payload);
    if (res.success) {
      const repRes = await getReportAction(order.orderId);
      setUploadedReport(repRes.report);
      Swal.fire({ icon: "success", title: "Success!", text: res.message, timer: 1500 });

      if (allReportCompleted) {
        await updateTestOrderStatus(orderId, "completed");
        setOrder({ ...order, orderStatus: "completed" });
      }
    }
  }

  if (loading) return <ReportSkeleton />;

  return (
    <div className="bg-bg min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/lab/test-order-update" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <MdArrowBack size={24} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-black text-text">Upload Diagnostic Report</h1>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Patient Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6 ">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-text mb-4 flex items-center gap-2">
                <MdPerson className="text-primary" /> Patient Record
              </h2>
              <div className="space-y-3 p-4 bg-bg rounded-2xl border border-gray-50">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</p>
                  <p className="font-bold text-text">{order?.patient?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Number</p>
                  <p className="font-bold text-text">{order?.patient?.phone}</p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">ID: {order?.patientId}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order?.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {order?.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <label className={`flex flex-col items-center justify-center gap-2 cursor-pointer h-24 w-24 rounded-2xl border-2 border-dashed transition-all ${loadFile ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-bg'}`} htmlFor="up">
                    <input type="file" id="up" accept="application/pdf" onChange={(e) => handlePdf(e)} hidden disabled={loadFile} />
                    {loadFile ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    ) : (
                      <>
                        <MdUploadFile className="text-primary" size={28} />
                        <span className="text-[10px] font-black uppercase text-primary">PDF Only</span>
                      </>
                    )}
                  </label>
                  <div>
                    <h3 className="font-black text-text">Select Report File</h3>
                    <p className="text-xs text-gray-400">Upload clinical diagnostic PDF</p>
                  </div>
                </div>
                <span className="bg-bg px-4 py-2 rounded-xl border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                  INV-{order?.orderId}
                </span>
              </div>

              {/* Uploaded Files List */}
              <div className="space-y-3 mb-8">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Queue ({uploadedReport.length})</h4>
                {uploadedReport.length > 0 ? (
                  uploadedReport.map((item, i) => (
                    <a href={item} type="download" key={i} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-gray-100 hover:border-primary/20 transition-all group">
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

              <div className="space-y-6">
                <label htmlFor="checkFinal" className="flex items-center gap-3 select-none cursor-pointer p-4 bg-red-50/50 rounded-2xl border border-red-100">
                  <input
                    id="checkFinal"
                    type="checkbox"
                    className="w-5 h-5 rounded-md accent-red-600"
                    checked={allReportCompleted}
                    onChange={(e) => setAllReportCompleted(e.target.checked)}
                  />
                  <span className="text-sm font-black text-red-800 uppercase tracking-tight">
                    Finalize Order (All reports attached)
                  </span>
                </label>

                <button
                  disabled={uploadedReport.length === 0 || loadFile || order.orderStatus === "completed"}
                  onClick={reportUploadOnDB}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {loadFile ? "Uploading to Server..." : "Submit to Database"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="bg-bg min-h-screen py-8 px-4 md:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8"></div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 h-64 bg-white rounded-3xl"></div>
          <div className="col-span-8 h-96 bg-white rounded-[2.5rem]"></div>
        </div>
      </div>
    </div>
  );
}