import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <>
            <header>
                <div className="container">
                    <div></div>
                    <nav>
                        <ul className="flex items-center gap-6 text-sm text-text">
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
                    </ul>
                </nav>
                <div></div>
            </div>
        </header >
        </>
    )
}
