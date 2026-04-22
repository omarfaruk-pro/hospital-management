"use client"

import { useState } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import NavLink from "../component/NavLink";



export default function ManagerSideBar() {
    const [roomOpen, setRoomOpen] = useState(false);

    return (
        <>
            <button onClick={() => setRoomOpen(!roomOpen)} className={`fixed z-50 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out backdrop-blur-xl bg-white border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.08),0_5px_15px_rgba(0,0,0,0.2)] rounded-full p-2.5 ${roomOpen ? "left-66" : "left-0"}`}>
                {
                    roomOpen
                        ? <TbLayoutSidebarLeftCollapse className="text-primary text-xl drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
                        : <TbLayoutSidebarLeftExpand className="text-primary text-xl drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
                }
            </button>

            <div
                className={`fixed  top-0 left-0 h-full w-72  transform transition-transform duration-300 ease-in-out ${roomOpen ? "translate-x-0" : "-translate-x-full"} p-4 overflow-y-auto bg-bg rounded-tr-3xl rounded-br-3xl  z-5`}
            >
                <ul>
                    <li>
                        <NavLink href="/manager">Home</NavLink>
                    </li>
                    <li>
                        <NavLink href="/manager/all-orders">All Orders</NavLink>
                    </li>
                    <li>
                        <NavLink href="/manager/all-tests">All Tests</NavLink>
                    </li>
                </ul>
            </div>
        </>
    )
}