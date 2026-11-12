import { getAuthServer } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/connection";
import User from "@/models/user.model";
import { log } from "console";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDatabase();
    const session: any = await getAuthServer();
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const userId = searchParams.get("userId");
console.log(userId, "userId");
    const users = await User.find({
      _id: { $ne: userId},
    })  
      .select("name username _id email profilePhoto")
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}