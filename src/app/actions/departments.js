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

export async function getAllDepartmentsForManager() {
    try {
        const db = await connectDB();

        const departments = await db
            .collection("departments")
            .aggregate([
                {
                    $project: {
                        _id: { $toString: "$_id" },
                        name: 1,
                        isActive: 1,
                        slug: 1,
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


export async function addDepartment(payload) {
    try {
        const db = await connectDB();
        const result = await db.collection("departments").insertOne(payload);
        return { success: true, message: "Department added successfully" };
    } catch (e) {
        return { success: false, message: e.message || "Failed to add department" };
    }
}

export async function updateDepartment(id, payload) {
    try {
        const db = await connectDB();
        const result = await db.collection("departments").updateOne({ _id: new ObjectId(id) }, { $set: payload });
        if (result.modifiedCount !== 0) {
            return { success: true, message: "Department updated successfully" };
        }
        return { success: false, message: "No department found to update" };
    } catch (e) {
        return { success: false, message: e.message || "Failed to update department" };
    }
}

export async function deleteDepartment(id) {
    try {
        const db = await connectDB();
        const result = await db.collection("departments").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount !== 0) {
            return { success: true, message: "Department deleted successfully" };
        }
        return { success: false, message: "No department found to delete" };
    } catch (e) {
        return { success: false, message: e.message || "Failed to delete department" };
    }
}