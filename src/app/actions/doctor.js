"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export async function getAllDoctors() {
    try {
        const db = await connectDB();

        const doctors = await db
            .collection("doctors-list")
            .aggregate([
                {
                    $project: {
                        _id: { $toString: "$_id" },
                        name: 1,
                        email: 1,
                        number: 1,
                        experienceYears: 1,
                        designation: 1,
                        registrationNumber: 1,
                        photoUrl: 1,
                        status: 1,
                    },
                },
            ])
            .toArray();

        return {
            success: true,
            doctors,
        };
    } catch (e) {
        throw new Error("Failed to fetch doctors");
    }
}



export async function deleteDoctor(id) {
    const db = await connectDB();
    const result = await db.collection("doctors-list").deleteOne({ _id: new ObjectId(id) });
    return { success: true, message: "Doctor deleted successfully" };
}


export async function addNewDoctor(payload) {
    const db = await connectDB();
    try {
        const result = await db.collection("doctors-list").insertOne(payload);
        return { success: true, message: "Doctor added successfully" };
    } catch (e) {
        return { success: false, message: e.message || "Failed to add doctor" };
    }
}


export async function updateDoctor(doctorId, payload) {
    const db = await connectDB();
    try {
        const result = await db.collection("doctors-list").updateOne({ _id: new ObjectId(doctorId) }, { $set: payload });
        return { success: true, message: "Doctor updated successfully" };
    } catch (e) {
        return { success: false, message: e.message || "Failed to update doctor" };
    }
}