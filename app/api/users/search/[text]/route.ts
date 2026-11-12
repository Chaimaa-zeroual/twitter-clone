import { connectDatabase } from "@/lib/connection";
import User from "@/models/user.model";
import Post from "@/models/post.model";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { text: string } }) {
  try {
    await connectDatabase();
    const { text } = route.params;
    console.log(text, "text");

    // 🔎 Rechercher les utilisateurs
    const users = await User.find({
      $or: [
        { name: { $regex: text, $options: "i" } },
        { username: { $regex: text, $options: "i" } },
        { email: { $regex: text, $options: "i" } },
      ],
    });

    // 🔎 Rechercher dans les publications avec l'image et les informations de l'utilisateur
    const posts = await Post.find({
      text: { $regex: text, $options: "i" },
    }).populate("user", "name username profilePhoto")
      .sort({ createdAt: -1 }); // Tri des publications les plus récentes en premier

    return NextResponse.json({ users, posts });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
