

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, className = "" }) {
    const pathname = usePathname();

    const isActive =
        pathname === href;

    return (
        <Link
            href={href}
            className={`${isActive
                ? "text-blue-600"
                : ""
                } ${className}`}
        >
            {children}
        </Link>
    );
}