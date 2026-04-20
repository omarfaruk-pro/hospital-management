"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export async function getAllTests() {
    const db = await connectDB();
    const tests = await db.collection("tests").aggregate([
        {
            $project: {
                name: 1,
                price: 1,
                category: 1,
                _id: { $toString: "$_id" },
                reportTime: 1,
            }
        }
    ]).toArray()
    return {
        success: true,
        tests,
    };
}



export async function createOrder(data) {
    const db = await connectDB();

    const {
        patientId,
        testsIds,
        testDetails,
        subtotal,
        discountPercent = 0,
        discountAmount = 0,
        total,
        paymentStatus = "unpaid",
        paidAmount = 0,
        dueAmount = 0,
        orderStatus = "pending",
        doctorId = null,
        createdBy = null,
    } = data;


    // 🧠 basic validation
    if (!patientId || !testsIds || testsIds.length === 0 || !total) {
        return {
            success: false,
            message: "Missing required fields",
        };
    }

    const collection = db.collection("orders");

    // 🧠 STEP 1: ensure meta doc exists
    await collection.updateOne(
        { type: "meta" },
        {
            $setOnInsert: {
                type: "meta",
                lastOrderId: 1000,
                createdAt: new Date(),
            },
        },
        { upsert: true }
    );

    // 🧠 STEP 2: atomic increment
    const meta = await collection.findOneAndUpdate(
        { type: "meta" },
        {
            $inc: { lastOrderId: 1 },
        },
        {
            returnDocument: "after",
        }
    );

    const nextId = meta.lastOrderId;
    const orderId = `ORD-${nextId}`;

    // 💾 STEP 3: insert order
    const result = await collection.insertOne({
        type: "order",

        orderId,
        patientId,

        testsIds,
        testDetails,

        subtotal,
        discountPercent,
        discountAmount,
        total,

        paymentStatus,
        paidAmount,
        dueAmount,

        orderStatus,

        doctorId,
        createdBy,

        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {
        success: true,
        orderId,
        insertedId: result.insertedId.toString(),
    };
}


export async function findOrderById(orderId) {
    const db = await connectDB();

    const result = await db.collection("orders").aggregate([
        {
            $match: {
                _id: new ObjectId(orderId),
                type: "order",
            },
        },

        // 🔗 join with patient-info
        {
            $lookup: {
                from: "patient-info",
                localField: "patientId",
                foreignField: "patientId",
                as: "patient",
            },
        },

        // 📦 array → object
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },

        // 🎯 optional clean response
        {
            $project: {
                _id: { $toString: "$_id" },
                orderId: 1,
                patientId: 1,

                testsIds: 1,
                testDetails: 1,

                subtotal: 1,
                discountPercent: 1,
                discountAmount: 1,
                total: 1,

                paymentStatus: 1,
                paidAmount: 1,
                dueAmount: 1,

                orderStatus: 1,

                createdAt: 1,

                patient: {
                    name: "$patient.name",
                    phone: "$patient.phone",
                    gender: "$patient.gender",
                    dob: "$patient.dob",
                },
            },
        },
    ]).toArray();

    const order = result[0];

    if (!order) {
        return { success: false, message: "Order not found" };
    }

    return { success: true, order };
}



export async function getAllTestOrders() {
    try {
        const db = await connectDB();

        const orders = await db.collection("orders")
            .aggregate([
                {
                    $match: {
                        type: "order",
                    },
                },

                // 🔗 patient join
                {
                    $lookup: {
                        from: "patient-info",
                        localField: "patientId",
                        foreignField: "patientId",
                        as: "patient",
                    },
                },

                {
                    $unwind: {
                        path: "$patient",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                // 🔥 clean response
                {
                    $project: {
                        _id: { $toString: "$_id" },
                        orderId: 1,
                        patientId: 1,

                        total: 1,
                        dueAmount: 1,
                        paymentStatus: 1,
                        orderStatus: 1,

                        createdAt: 1,

                        patientName: "$patient.name",
                        patientPhone: "$patient.phone",
                        dob: "$patient.dob",
                    },
                },

                // 📅 latest first
                {
                    $sort: { createdAt: -1 },
                },
            ])
            .toArray();

        return {
            success: true,
            data: orders,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            data: [],
        };
    }
}


export async function deleteTestOrder(orderId) {
    const db = await connectDB();

    const result = await db.collection("orders").deleteOne({
        _id: new ObjectId(orderId),
        type: "order",
    });

    return { success: true, message: "Order deleted successfully" };
}