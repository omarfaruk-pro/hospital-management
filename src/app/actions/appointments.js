"use server";

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

  const normalizedDate = new Date(date).toISOString().split("T")[0];

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