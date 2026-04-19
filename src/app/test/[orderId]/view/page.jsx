"use client";

import { findOrderById } from "@/app/actions/tests";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Invoice from "./Invoice";

export default function LabOrderView() {
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getorder = async () => {
            const res = await findOrderById(orderId);
            setOrder(res);
            setLoading(false);
        };
        getorder();
    }, [orderId]);

    console.log(loading, order)

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Invoice data={order} />
            )}
        </>
    );
}