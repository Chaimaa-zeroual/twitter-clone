import { connectDatabase } from "@/lib/connection";
import Notification from "@/models/notification.model";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDatabase();
    const { postId, userId, isLike } = await req.json();

    console.log(postId, userId, isLike, "postId, userId, isLike");

    // ✅ Mettre à jour les likes du post
    const post = await Post.findByIdAndUpdate(
      postId,
      isLike ? { $push: { likes: userId } } : { $pull: { likes: userId } },
      { new: true }
    )
      .populate("user")
      .populate("likes");

    if (!post || !post.user) {
      return NextResponse.json(
        { error: "Post non trouvé ou utilisateur non associé." },
        { status: 404 }
      );
    }

    // ✅ Récupérer les informations de l'utilisateur qui a liké
    const sender = await User.findById(userId);

    if (!sender) {
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    // ✅ Ajouter une notification seulement si l'utilisateur qui like est différent de l'auteur du post
    if (isLike && post.user._id.toString() !== userId) {
      await Notification.create({
        user: post.user._id, // Auteur du post
        type: "like",
        text: `${sender.name} a aimé votre post.`,
        post: postId,
        sender: userId, // Utilisateur qui a liké
      });

      // ✅ Mettre à jour l'auteur du post pour indiquer une nouvelle notification
      await User.findByIdAndUpdate(
        post.user._id,
        { hasNewNotifications: true },
        { new: true }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
