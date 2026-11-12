import { IPost, IUser } from "@/types";
import { Heart, Loader2, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { sliceText } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import axios from "axios";

interface Props {
  comment: IPost;
  user: IUser;
  setComments: Dispatch<SetStateAction<IPost[]>>;
  comments: IPost[];
  setPost?: Dispatch<SetStateAction<IPost | null>>; // Pour mettre à jour le post parent
}

const CommentItem = ({ comment, user, setComments, comments, setPost }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const goToProfile = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/profile/${comment.user._id}`); // Corrigé ici
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/comments/${comment?._id}`);

      // Supprimer le commentaire de la liste
      setComments((prev) => prev.filter((item) => item._id !== comment._id));

      // Mettre à jour le nombre total de commentaires dans `setPost`
      if (setPost) {
        setPost((prevPost) => {
          if (!prevPost) return null;

          const newCommentsCount = prevPost.comments > 0 ? prevPost.comments - 1 : 0;

          return {
            ...prevPost,
            commentsCount: newCommentsCount,
          };
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b-[1px] relative border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-50">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        </div>
      )}
      <div className="flex flex-row items-center gap-3">
        <Avatar onClick={goToProfile}>
          <AvatarImage src={comment?.user.profilePhoto} />
          <AvatarFallback className="capitalize">
            {comment?.user.name[0]}
          </AvatarFallback>
        </Avatar>

        <div>
          <div
            className="flex flex-row items-center gap-2"
            onClick={goToProfile}
          >
            <p className="text-white font-semibold cursor-pointer hover:underline">
              {comment?.user.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
              {comment?.user.username
                ? `@${sliceText(comment.user.username, 20)}`
                : sliceText(comment.user.email, 20)}
            </span>
            <span className="text-neutral-500 text-sm">
              {comment.createdAt && formatDistanceToNowStrict(new Date(comment.createdAt))}
            </span>
          </div>
          <div className="text-white mt-1">{comment?.text}</div>

          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
            >
            </div>

            {comment.user._id === user._id && (
              <div
                className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
                onClick={onDelete}
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

export default CommentItem;
