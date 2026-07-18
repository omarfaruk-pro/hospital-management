export default function TableSkeleton() {
    return Array(5).fill(0).map((_, i) => (
        <tr key={i} className="animate-pulse">
            <td className="px-8 py-5"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
            <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
            <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
            <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
            <td className="px-8 py-5 text-right"><div className="h-8 bg-gray-100 rounded w-8 ml-auto"></div></td>
        </tr>
    ));
}