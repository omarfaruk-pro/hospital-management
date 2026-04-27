"use server"

import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";


export const saveRefreshToken = async (userId, token) => {
    const db = await connectDB();

    await db.collection("refresh-tokens").insertOne({
        userId,
        token,
        createdAt: new Date(),
    });
};

export const deleteRefreshToken = async (token) => {
    const db = await connectDB();

    await db.collection("refresh-tokens").deleteOne({
        token,
    });
};

export const checkRefreshToken = async (userId, token) => {
    const db = await connectDB();

    const found = await db.collection("refresh-tokens").findOne({
        userId: new ObjectId(userId),
        token,
    });

    return !!found;
};