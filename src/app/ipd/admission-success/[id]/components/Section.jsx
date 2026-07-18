export default function Section({
    title,
    children,
}) {
    return (
        <section className="px-10 pt-8">

            <div className="mb-5 flex items-center gap-3">

                <div className="h-6 w-1 rounded bg-blue-700"></div>

                <h3 className="text-lg font-bold text-slate-800">
                    {title}
                </h3>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
                {children}
            </div>

        </section>
    );
}