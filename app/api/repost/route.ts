import { connectDatabase } from "@/lib/connection";
import Notification from "@/models/notification.model";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
    }

    // Récupérer le post original
    const originalPost = await Post.findById(postId).populate("user");
    if (!originalPost) {
      return NextResponse.json({ error: "Post introuvable." }, { status: 404 });
    }

    // Empêcher l'utilisateur de republier son propre post (optionnel)
    if (originalPost.user._id.toString() === userId) {
      return NextResponse.json({ error: "Vous ne pouvez pas republier votre propre post." }, { status: 400 });
    }

    // Créer une nouvelle republication
    const repost = await Post.create({
      user: userId,
      text: originalPost.text,
      originalPost: postId, // Lien vers le post original
      isRepost: true,
    });

    // Ajouter la republication dans le post original
    await Post.findByIdAndUpdate(
      postId,
      { $push: { reposts: repost._id } },
      { new: true }
    );

    // Récupérer les infos de l'utilisateur qui republie
    const user = await User.findById(userId);

    // Envoyer une notification au créateur du post original
    await Notification.create({
      user: originalPost.user._id, // Auteur du post original
      type: "repost",
      text: `${user?.name} a republié votre post.`,
      post: postId,
      sender: userId, // Utilisateur qui a republié
    });
    const newNotification = await Notification.create({
      user: originalPost.user._id, // Auteur du post original
      type: "repost",
      text: `${user?.name} a republié votre post.`,
      post: postId,
      sender: userId, // Utilisateur qui a republié
    });
    
    console.log("✅ Notification de republication créée :", newNotification);
    
    // Marquer une nouvelle notification
    await User.findByIdAndUpdate(
      originalPost.user._id,
      { hasNewNotifications: true },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Post republié avec succès.",
      repost,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
