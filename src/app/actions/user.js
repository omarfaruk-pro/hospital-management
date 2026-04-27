"use server";
import { ObjectId } from "mongodb";
import { connectDB } from "../lib/mongoConnect";

export const getUserByEmail = async (email) => {
  const db = await connectDB();

  const user = await db.collection("users").findOne(
    { email: email.toLowerCase() },
    {
      projection: {
        password: 1,
        role: 1,
        email: 1,
        name: 1,
      },
    }
  );

  return user;
};



export const getUserById = async (id) => {
  const db = await connectDB();

  const user = await db.collection("users").findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        password: 0, 
        refreshTokens: 0,
      },
    }
  );

  return user;
};