

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/app/lib/mongoConnect";

export async function POST(req) {
    try {
        const body = await req.json();

        const db = await connectDB();

        // check selected bed still valid
        const bed = await db.collection("beds").findOne({
            _id: new ObjectId(body.bedId),

            status: "selected",
        });

        if (!bed) {
            return NextResponse.json({
                success: false,
                message: "Bed reservation expired",
            });
        }

        // create admission
        const admissionData = {
            patientName: body.patientName,
            age: body.age,
            gender: body.gender,
            phone: body.phone,
            address: body.address,
            bloodGroup: body.bloodGroup,

            doctorName: body.doctorName,

            diagnosis: body.diagnosis,

            emergencyName: body.emergencyName,
            emergencyPhone: body.emergencyPhone,

            bedId: body.bedId,

            admittedAt: new Date(),

            status: "active",
        };

        const admissionRes = await db
            .collection("admissions")
            .insertOne(admissionData);

        // update bed occupied
        const bedRes = await db.collection("beds").updateOne(
            {
                _id: new ObjectId(body.bedId),
            },
            {
                $set: {
                    status: "occupied",

                    occupiedAt: new Date(),

                    admissionId: admissionRes.insertedId,
                },

                $unset: {
                    selectedAt: "",
                    selectedBy: "",
                    reservationExpiresAt: "",
                },
            }
        );

        if (bedRes.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Failed to update bed status",
            });
        }
        return NextResponse.json({
            success: true,
            message: "Admission successful",
            admissionId: admissionRes.insertedId,
        });
    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}