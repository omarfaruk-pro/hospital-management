"use server";

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
        testIds,
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
    if (!patientId || !tests || tests.length === 0 || !total) {
        throw new Error("Missing required fields");
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

        testIds,
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