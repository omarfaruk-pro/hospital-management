import { getPages } from "../lib/pagination";

export default function PaginationUi({ page, totalPages, handlePageChange, departments }) {
  return (
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
      <p className="text-sm text-gray-500 font-medium">Total departments: {departments.length}</p>
    </div>
  )
}
