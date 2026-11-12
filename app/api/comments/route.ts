import { connectDatabase } from "@/lib/connection";
import Comment from "@/models/comment.model";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import Notification from "@/models/notification.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { text, postId, userId } = await req.json();

    // ✅ Créer le commentaire
    const comment = await Comment.create({ text, post: postId, user: userId });

    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment?._id },
      },
      { new: true }
    );

    // ✅ Récupérer l'auteur du post
    const post = await Post.findById(postId).populate("user");

    // ✅ Récupérer les informations de l'utilisateur qui a commenté
    const sender = await User.findById(userId);

    // ✅ Créer la notification avec le nom du user
    if (post.user._id.toString() !== userId) {
      await Notification.create({
        user: post.user._id, // Auteur du post
        type: "comment",
        text: `${sender.name} a commenté votre poste.`,
        post: postId,
        sender: userId, // Utilisateur qui a commenté
      });
    }

    return NextResponse.json(comment);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
