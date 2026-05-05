"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export async function getAllDepartments() {
    try {
        const db = await connectDB();

        const departments = await db
            .collection("departments")
            .aggregate([
                { $match: { isActive: true } },
                {
                    $project: {
                        _id: { $toString: "$_id" },
                        name: 1,
                    },
                },
            ])
            .toArray();

        return {
            success: true,
            departments,
        };
    } catch (e) {
        return { success: false, message: "Failed to fetch departments" };
    }
}
