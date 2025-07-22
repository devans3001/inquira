import Link from "next/link";
import React from "react";
import Avatar from "./avatar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

function Header() {
  return (
    <header className="bg-white shadow-sm text-gray-500 flex justify-between p-5 items-center">
      <Link href="/" className="flex items-center font-thin text-4xl gap-2">
        <Avatar seed="devans" className="rounded-full" size={{w:50,h:50}}/>
        <div>
          <h1>Inquira</h1>
          <h2 className="text-sm">Your customizable Ai Chat Agent</h2>
        </div>
      </Link>

      <div  className="cursor-pointer">
        <SignedIn>
          <UserButton showName/>
        </SignedIn>

        <SignedOut>
          <SignInButton/>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
