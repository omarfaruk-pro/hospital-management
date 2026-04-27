import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <>
            <header className="bg-bg shadow-sm py-4">
                <div className="container flex items-center justify-between">
                    <div></div>
                    <nav>
                        <ul className="flex items-center gap-6 text-text text-lg font-medium">
                        <li>
                            <Link href="#" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-primary transition-colors">
                                Doctors
                            </Link>
                        </li>
                        <li>
                            <Link href="/my-appointments" className="hover:text-primary transition-colors">
                                My Appointments
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-primary transition-colors">
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div></div>
            </div>
        </header >
        </>
    )
}
