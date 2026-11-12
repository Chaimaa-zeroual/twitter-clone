import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Edit2, ImageDown, Video } from "lucide-react";
import Image from "next/image";

interface Props {
  media: string;
  setMedia: React.Dispatch<React.SetStateAction<string>>;
  onChange: (mediaUrl: string) => void;
  isPost?: boolean;
}

const ProfileMediaUpload = ({ media, setMedia, onChange, isPost }: Props) => {
  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setMedia(event.target.result);
        onChange(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    [onChange, setMedia]
  );

  const { getInputProps, getRootProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "video/mp4": [],
      "video/webm": [],
    },
  });

  return (
    <div
      {...getRootProps({ className: "text-white text-center border-none rounded-md" })}
    >
      <input {...getInputProps()} />
      {media ? (
        isPost ? (
          <div className="relative transition cursor-pointer w-full h-80 border-4 border-black">
            {media.includes("video") ? (
              <video className="w-full h-full object-cover rounded-lg" controls>
                <source src={media} />
              </video>
            ) : (
              <Image
                src={media}
                alt="Uploaded media"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            )}
            <div className="absolute inset-0 flex justify-center items-center">
              <Edit2 size={24} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="h-44 relative bg-neutral-800">
            {media.includes("video") ? (
              <video className="w-full h-full object-cover" controls>
                <source src={media} />
              </video>
            ) : (
              <Image
                src={media}
                alt="Uploaded media"
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
        )
      ) : (
        <div className="relative">
          <ImageDown className="absolute top-8" />
        </div>
      )}
    </div>
  );
};

export default ProfileMediaUpload;
