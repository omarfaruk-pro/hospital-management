"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

// all doctors
export async function getDoctors() {
    const db = await connectDB();

    const doctors = await db.collection("doctors-list").aggregate([
        {
            $match: { status: "active" }
        },

        {
            $addFields: {
                departmentObjectIds: {
                    $map: {
                        input: "$departmentIds",
                        as: "id",
                        in: { $toObjectId: "$$id" }
                    }
                }
            }
        },

        {
            $lookup: {
                from: "departments",
                localField: "departmentObjectIds",
                foreignField: "_id",
                as: "departments"
            }
        },

        {
            $project: {
                name: 1,
                photoUrl: 1,
                designation: 1,
                experienceYears: 1,
                schedule: 1,
                fee: 1,
                departments: {
                    name: 1,
                    slug: 1
                }
            }
        },

        {
            $addFields: {
                _id: { $toString: "$_id" }
            }
        },

        {
            $limit: 8
        }
    ]).toArray();

    return doctors;
}


// single doctor details
export async function getDoctorById(id) {
    const db = await connectDB();
    const doctor = await db.collection("doctors-list").aggregate([
        {
            $match: {
                _id: new ObjectId(id)
            }
        },


        {
            $addFields: {
                departmentObjectIds: {
                    $map: {
                        input: "$departmentIds",
                        as: "id",
                        in: { $toObjectId: "$$id" }
                    }
                }
            }
        },

        // 👉 departments join
        {
            $lookup: {
                from: "departments",
                localField: "departmentObjectIds",
                foreignField: "_id",
                as: "departments"
            }
        },

        {
            $addFields: {
                departments: {
                    $map: {
                        input: "$departments",
                        as: "dept",
                        in: {
                            _id: { $toString: "$$dept._id" },
                            name: "$$dept.name",
                            slug: "$$dept.slug"
                        }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                photoUrl: 1,
                designation: 1,
                experienceYears: 1,
                fee: 1,
                education: 1,
                workExperiences: 1,
                schedule: 1,
                emergencyContact: 1,
                departments: 1,
                createdAt: 1
            }
        },

        {
            $addFields: {
                _id: { $toString: "$_id" }
            }
        }
    ]).next();

    return doctor;
}