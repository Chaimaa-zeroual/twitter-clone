

import { IPost, IUser } from "@/types";
import { Heart, Loader2, MessageCircle, Trash2, Repeat } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { sliceText } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  posts: IPost[];
  post: IPost;
  user: IUser;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  isProfilePage?: boolean;
  isExplorePage?: boolean;
}

const PostCard = ({
  posts,
  post,
  user,
  setPosts,
  isProfilePage,
  isExplorePage,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [isLike, setIsLike] = useState(
    post?.likes?.some((likeUser: any) => likeUser?._id === user?._id) ?? false
  );

  // Aimer ou ne plus aimer une publication
  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      setIsLoading(true);

      const { data } = await axios.put("/api/likes", {
        postId: post?._id,
        userId: user?._id,
        isLike: !isLike,
      });

      if (data?.success) {
        setPosts((prev) =>
          prev.map((item) =>
            item?._id === data?.post?._id
              ? { ...data.post, user: item.user }
              : item
          )
        );

        setIsLike(
          data?.post?.likes?.some(
            (likeUser: any) => likeUser?._id === user?._id
          ) ?? false
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Accéder au profil
  const goToProfile = (userId: string) => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  // Supprimer une publication
  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      setIsLoading(true);

      const { data } = await axios.delete("/api/posts", {
        data: { postId: post?._id },
      });

      if (data?.success) {
        setPosts((prev) =>
          prev.filter((item) => item?._id !== post?._id)
        );

        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ouvrir une publication
  const handlePost = () => {
    router.push(`/posts/${post?._id}`);
  };

  // Repartager une publication
  const handleRepost = async (event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/posts", {
        text: post?.text || "",
        image: post?.image || "",
        userId: user?._id,
        repostedFrom: post?._id,
      });

      if (data?.success) {
        setPosts((prev) => [data.post, ...prev]);

        toast({
          title: "Success",
          description: "You have successfully reposted this post.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative border-b border-neutral-800 p-4 hover:bg-neutral-900 transition">

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Loader2 className="animate-spin text-sky-500" size={32} />
        </div>
      )}

      <div className="flex gap-3">

        {/* Avatar */}
        <Avatar
          onClick={() => goToProfile(post?.user?._id)}
          className="cursor-pointer"
        >
          <AvatarImage src={post?.user?.profilePhoto} />
          <AvatarFallback className="uppercase">
            {post?.user?.name ? post.user.name[0] : "?"}
          </AvatarFallback>
        </Avatar>

        <div className="w-full">

          {/* Informations utilisateur */}
          <div className="flex items-center gap-2 flex-wrap">

            <p
              className="text-white font-semibold cursor-pointer hover:underline capitalize"
              onClick={() => goToProfile(post?.user?._id)}
            >
              {post?.user?.name}
            </p>

            <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
              {post?.user?.username
                ? `@${sliceText(post.user.username, 16)}`
                : post?.user?.email
                ? sliceText(post.user.email, 16)
                : ""}
            </span>

            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(new Date(post?.createdAt))}
            </span>

          </div>

          {/* Texte de la publication */}
          <p
            className="text-white mt-1 text-xl cursor-pointer"
            onClick={handlePost}
          >
            {post?.text}
          </p>

          {/* Image */}
          {post?.image && (
            <div
              className="h-80 max-h-96 w-full cursor-pointer"
              onClick={handlePost}
            >
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center mt-3 gap-10">

            {/* Commentaires */}
            <div
              onClick={handlePost}
              className="flex text-neutral-500 items-center gap-2 cursor-pointer transition hover:text-sky-500"
            >
              <MessageCircle size={20} />
              <p>{post?.comments?.length || 0}</p>
            </div>

            {/* Likes */}
            <div
              onClick={handleLike}
              className="flex items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
            >
              <Heart
                size={20}
                color={isLike ? "red" : "gray"}
                fill={isLike ? "red" : "none"}
              />
              <p>{post?.likes?.length || 0}</p>
            </div>

            {/* Repost */}
            <div
              onClick={handleRepost}
              className="flex items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500"
            >
              <Repeat size={20} />
              <p>Repost</p>
            </div>

            {/* Suppression */}
            {post?.user?._id === user?._id && !isExplorePage && (
              <div
                onClick={handleDelete}
                className="flex items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
              >
                <Trash2 size={20} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;





