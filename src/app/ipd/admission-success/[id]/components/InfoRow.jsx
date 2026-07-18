export default function InfoRow({
    label,
    value,
}) {
    return (
        <div>

            <p className="text-xs uppercase tracking-wider text-slate-400">

                {label}

            </p>

            <p className="mt-1 wrap-break-word text-base font-semibold text-slate-800">

                {value || "-"}

            </p>

        </div>
    );
}