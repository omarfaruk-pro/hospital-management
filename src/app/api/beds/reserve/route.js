

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/app/lib/mongoConnect";

export async function POST(req) {
  try {
    const body = await req.json();

    const db = await connectDB();

    const result = await db.collection("beds").updateOne(
      {
        _id: new ObjectId(body.bedId),

        status: "available",
      },
      {
        $set: {
          status: "selected",

          selectedAt: new Date(),

          reservationExpiresAt: new Date(
            Date.now() + 15 * 60 * 1000
          ),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Bed already reserved",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Bed reserved successfully",
    });
  } catch (error) {
    console.log(error);

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