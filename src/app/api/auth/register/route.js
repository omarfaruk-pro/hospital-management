import { getUserByEmail } from "@/app/actions/user";
import { connectDB } from "@/app/lib/mongoConnect";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();
  const db = await connectDB();

  const existing = await getUserByEmail(email);
  if (existing) {
    return Response.json({ message: "User exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashed,
    role: "pending",
  });

  if (!result.insertedId) {
    return Response.json({ message: "Failed to create user" }, { status: 500 });
  }

  return Response.json({success: true, message: "User created successfully", result});
}