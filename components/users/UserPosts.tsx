"use client";
import { IPost, IUser } from "@/types";
import React, { useEffect, useState } from "react";
import PostCard from "../post/PostCard";

interface Props {
  user: IUser;
  getPosts: IPost[];
}

const UserPosts = ({ user, getPosts }: Props) => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    console.log("getPosts from API:", getPosts);  // ✅ Debugging
    setPosts(getPosts);
  }, [getPosts]);

  return !posts?.length ? (
    <div className="flex justify-center items-center h-24">No post exists</div>
  ) : (
    posts?.map((post) =>
      post?.user ? (  // ✅ Vérifie que `post.user` existe avant d'afficher
        <PostCard
          key={post?._id}
          post={{
            ...post,
            user: {
              ...post.user,
              profilePhoto: post.user.profilePhoto || user.profilePhoto, // ✅ Fix photo profil
            },
          }}
          posts={posts}
          setPosts={setPosts}
          user={user}
        />
      ) : (
        <div key={post?._id} className="text-red-500">
          🚨 Erreur: L'utilisateur est manquant pour ce post
        </div>
      )
    )
  );
};

export default UserPosts;
