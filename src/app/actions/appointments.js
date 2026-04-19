"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export async function createAppointment(data) {
  const db = await connectDB();

  const {
    name,
    phone,
    email,
    date,
    doctorId,
    type = "OPD",
    status = "confirm",
  } = data;

  if (!name || !phone || !doctorId || !date) {
    throw new Error("Missing required fields");
  }

  const normalizedDate = date.toLocaleDateString("en-CA");

  // 🧠 STEP 1: ensure meta document exists (NO lastSerial here)
  await db.collection("appointments").updateOne(
    {
      type: "meta",
      doctorId,
      date: normalizedDate,
    },
    {
      $setOnInsert: {
        type: "meta",
        doctorId,
        date: normalizedDate,
        lastSerial: 0,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 🧠 STEP 2: atomic increment (SEPARATE OPERATION)
  const meta = await db.collection("appointments").findOneAndUpdate(
    {
      type: "meta",
      doctorId,
      date: normalizedDate,
    },
    {
      $inc: { lastSerial: 1 },
    },
    {
      returnDocument: "after",
    }
  );

  const serialNo = meta.lastSerial;

  // 💾 insert appointment
  const result = await db.collection("appointments").insertOne({
    type: "appointment",

    patientName: name,
    phone,
    email: email || null,

    doctorId,
    date: normalizedDate,

    status,
    serialNo,

    createdAt: new Date(),
  });

  return {
    success: true,
    appointmentId: result.insertedId.toString(),
    serialNo,
  };
}



export async function getMyAppointments(phone) {
  if (!phone) return [];

  const db = await connectDB();

  const appointments = await db
    .collection("appointments")
    .aggregate([
      {
        $match: {
          type: "appointment",
          phone: phone,
        },
      },

      // 👉 doctor join
      {
        $addFields: {
          doctorObjectId: { $toObjectId: "$doctorId" },
        },
      },
      {
        $lookup: {
          from: "doctors-list",
          localField: "doctorObjectId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },

      // 👉 clean response
      {
        $project: {
          _id: { $toString: "$_id" },
          date: 1,
          serialNo: 1,
          status: 1,
          patientName: 1,
          doctorName: "$doctor.name",
          designation: "$doctor.designation",
          photoUrl: "$doctor.photoUrl",
          schedule: "$doctor.schedule",
        },
      },

      {
        $sort: { date: -1 },
      },
    ])
    .toArray();

  return appointments;
}



export async function cancelAppointment(appointmentId) {
  if (!appointmentId) {
    throw new Error("Missing appointment ID");
  }
  const db = await connectDB();

  const result = await db.collection("appointments").updateOne({
    _id: new ObjectId(appointmentId),
  }, {
    $set: {
      status: "cancel"
    }
  });

  if (result.modifiedCount === 0) {
    throw new Error("Appointment not found");
  }

  return { success: true };
}