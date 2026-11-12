"use client";

import { sidebarItemsFunc } from "@/lib/data";
import { IUser } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Sidebaritem from "../sidebar/Sidebaritem";
import SidebarPostButton from "../sidebar/SidebarPostButton";
import SidebarAccount from "../sidebar/SidebarAccount";
import Form from "../post/Form";
import { IPost } from "@/types";

const Sidebar = ({ user }: { user: IUser }) => {
  const sidebarItems = sidebarItemsFunc(user);

  // ✅ État pour gérer l'affichage de la modale
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  
  // ✅ État pour gérer les posts
  const [posts, setPosts] = useState<IPost[]>([]);

  // ✅ Fonction pour afficher/masquer la modale
  const togglePostForm = () => {
    setIsPostFormOpen((prev) => !prev);
  };

  return (
    <>
      <section className="sticky left-0 top-0 h-screen lg:w-[266px] w-fit flex flex-col justify-between py-4 pl-2">
        <div className="flex flex-col space-y-2">
          <div className="rounded-full h-14 w-14 p-4 flex items-center justify-center hover:bg-sky-300 hover:bg-opacity-10 cursor-pointer transition">
            <Image width={56} height={56} src={"/images/logo.svg"} alt="logo" />
          </div>

          {sidebarItems.map((item: any) => (
            <Link key={item.path} href={item.path}>
              <Sidebaritem {...item} />
            </Link>
          ))}

          {/* ✅ Toggle de la modale via onClick */}
          <div onClick={togglePostForm}>
            <SidebarPostButton />
          </div>
        </div>
        <SidebarAccount user={user} />
      </section>

      {/* ✅ Modale centrée */}
      {isPostFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-neutral-900 rounded-xl p-8 w-full max-w-4xl mx-4 relative h-[40vh]">
            {/* Bouton de fermeture */}
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={togglePostForm}
            >
              &times;
            </button>
            {/* Formulaire */}
            <Form
              placeholder="What's on your mind?"
              user={user}
              setPosts={setPosts}  // Passer setPosts ici
              posts={posts}  // Passer les posts actuels
            />

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;