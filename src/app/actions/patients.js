"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export async function findPatientById(patientId) {
    console.log(patientId)
    try {
        if (!patientId) {
            return { success: false, message: "Patient ID required" };
        }

        const db = await connectDB() 
        const collection =await db.collection("patient-info");

        // if you are using custom patientId field
        const patient = await collection.findOne({
            patientId: patientId,
        });

        if (!patient) {
            return { success: false, message: "Patient not found" };
        }

        return {
            success: true,
            data: {
                id: patient.patientId || patient._id.toString(),
                name: patient.name,
                phone: patient.phone,
                gender: patient.gender,
                dob: patient.dob,
            },
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
}



export async function createPatient(data) {
    const db = await connectDB();

    const { name, phone, gender, dob } = data;

    if (!name || !phone || !gender || !dob) {
        return {
            success: false,
            message: "All fields are required",
        };
    }

    const collection = db.collection("patient-info");

    // 🧠 STEP 1: ensure meta document exists
    await collection.updateOne(
        { type: "meta" },
        {
            $setOnInsert: {
                type: "meta",
                lastPatientId: 1000,
                createdAt: new Date(),
            },
        },
        { upsert: true }
    );

    // 🧠 STEP 2: atomic increment
    const meta = await collection.findOneAndUpdate(
        { type: "meta" },
        {
            $inc: { lastPatientId: 1 },
        },
        {
            returnDocument: "after",
        }
    );

    const nextId = meta.lastPatientId;
    const patientId = `P-${nextId}`;

    // 💾 insert patient
    const result = await collection.insertOne({
        type: "patient",

        patientId,
        name,
        phone,
        gender,
        dob,

        createdAt: new Date(),
    });

    return {
        success: true,
        data: {
            id: patientId,
            name,
            phone,
            gender,
            dob
        },

    };
}