"use server";

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

 export async function reportUploadAction(data){
    const db = await connectDB();
    await db.collection("reports").insertOne(data);
    return { success: true, message: "Report added successfully"};
 }

 export async function getReportAction(orderId){
    const db = await connectDB();
    const report = await db.collection("reports").findOne({orderId});
    return report;
 }

 export async function getReportForPatient(orderId){
   const db= await connectDB();
   const result = await db.collection("orders").aggregate([
      {
         $match: {
            _id: new ObjectId(orderId)
         }
      },
      {
         $lookup: {
            from: "reports",
            localField: "orderId",
            foreignField: "orderId",
            as: "order"
         }
      },
      {
        $unwind: {
            path: "$order",
            preserveNullAndEmptyArrays: true
         }
      },
      {
         $project: {
            _id: 0,
            report: "$order.report",
            paymentStatus: 1,
            orderStatus: 1,
         }
      }
   ]).next();
   return result;
 }