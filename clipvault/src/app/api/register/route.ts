import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // This matches your schema.ts exactly now
    await db.insert(users).values({
      email: email,
      username: username,
      passwordHash: hashedPassword,
      role: 'user', // setting default role
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    console.error("DATABASE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}