import { BotMessageSquare, PencilLine, SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Sidebar() {
  const links = [
    {
      href: "/create-chatbot",
      top: "Create",
      bottom: "New Chatbot",
      icon: BotMessageSquare
    },
    {
      href: "/view-chatbot",
      top: "View",
      bottom: "Chatbot",
      icon: PencilLine
    },
    {
      href: "/review-sessions",
      top: "Review",
      bottom: "Sessions",
      icon: SearchIcon
    },
  ];
  return (
    <div className="bg-white text-white p-5">
      <ul className="gap-5 flex lg:flex-col">
        {links.map((ele) => (
          <li key={ele.href} className="flex-1">
            <Link
              href={ele.href}
              className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991ee]"
            >
                <ele.icon className="w-6 h-6 lg:w-8 lg:h-8" />
              <div className="hidden md:inline">
                <p className="text-xl">{ele.top}</p>
                <p className="text-sm font-extralight">{ele.bottom}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
