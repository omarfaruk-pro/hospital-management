import { getAdmissionSuccess } from "@/app/actions/admission";
import { notFound } from "next/navigation";
import PrintButton from "./components/PrintBtn";
import AdmissionSlip from "./components/AdmissionSlip";
import Link from "next/link";


export default async function AdmissionSuccessPage({ params }) {
  const { id } = await params;

  const result = await getAdmissionSuccess(id);

  if (!result.success) {
    return <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">
        Admission not found.
      </h1>
    </div>
  }
  const { _id, ...admissionData } = result?.data;

  return (
    <>
      <div className="min-h-screen bg-slate-100 py-10">
        <div className="mx-auto mb-6 flex w-[210mm] justify-between print:hidden">

          <div>
            <h1 className="text-2xl font-bold">
              Admission Completed
            </h1>
            <p className="text-slate-500">
              Review information before printing.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/ipd/new-admission" className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-white transition hover:bg-blue-800">
              New Admission
            </Link>
            <PrintButton />
          </div>

        </div>

        <AdmissionSlip data={admissionData} />

      </div>
    </>
  );
}