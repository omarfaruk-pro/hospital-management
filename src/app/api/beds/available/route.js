// app/api/beds/available/route.js

import { connectDB } from "@/app/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const gender = searchParams.get("gender");

    const db = await connectDB();

    // release expired reserved beds
    await db.collection("beds").updateMany(
      {
        status: "selected",
        reservationExpiresAt: {
          $lt: new Date(),
        },
      },
      {
        $set: {
          status: "available",
          selectedAt: null,
          selectedBy: null,
          reservationExpiresAt: null,
        },
      }
    );

    const beds = await db
      .collection("beds")
      .aggregate([
        {
          $lookup: {
            from: "accommodation",
            localField: "unitCode",
            foreignField: "code",
            as: "unit",
          },
        },

        {
          $unwind: "$unit",
        },

        {
          $match: {
            status: "available",

            "unit.type": type,

            ...(gender !== "common"
              ? {
                "unit.gender": gender,
              }
              : {}),
          },
        },

        {
          $project: {
            _id: 1,
            bedNumber: 1,
            status: 1,
            pricePerDay: 1,

            unitName: "$unit.name",
            type: "$unit.type",
            gender: "$unit.gender",
            facilities: "$unit.facilities",
          },
        },
      ])
      .toArray();

    return NextResponse.json(beds);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}