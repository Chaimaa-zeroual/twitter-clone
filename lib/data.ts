import { Bell, Bookmark, Home, Mail, Telescope, User } from "lucide-react";

export const sidebarItemsFunc = (user: any) => {
  const sidebarItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Explore",
      path: "/explore",
      icon: Telescope,
    },
    {
      label: "Notifications",
      path: `/notifications/${user?._id}`,
      icon: Bell,
      notification: user?.hasNewNotifications,
    },
    {
      label: "Message",
      path: `/message/${user?._id}`,
      icon: Mail,
    },
    {
      label: "Profile",
      path: `/profile/${user?._id}`,
      icon: User,
    },
  
  ];

  return sidebarItems;
};
