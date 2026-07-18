"use server";
import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export async function getAdmissionSuccess(admissionId) {
    try {
        const db = await connectDB();

        const result = await db
            .collection("admissions")
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(admissionId),
                    },
                },
                {
                    $lookup: {
                        from: "beds",
                        let: {
                            bedId: {
                                $toObjectId: "$bedId",
                            },
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$bedId"],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    unitCode: 1,
                                    bedNumber: 1,
                                    pricePerDay: 1,
                                    status: 1,
                                    occupiedAt: 1,
                                },
                            },
                        ],
                        as: "bed",
                    },
                },
                {
                    $unwind: {
                        path: "$bed",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,

                        patientName: 1,
                        age: 1,
                        gender: 1,
                        phone: 1,
                        address: 1,
                        bloodGroup: 1,

                        doctorName: 1,
                        diagnosis: 1,

                        admittedAt: 1,
                        status: 1,

                        emergencyContact: {
                            name: "$emergencyName",
                            phone: "$emergencyPhone",
                        },

                        bed: 1,
                    },
                },
            ])
            .toArray();

        if (!result.length) {
            return {
                success: false,
                message: "Admission not found",
            };
        }

        return {
            success: true,
            data: result[0],
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Something went wrong",
        };
    }
}