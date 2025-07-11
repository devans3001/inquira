"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditHeader({ id }: { id: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id]);
  return (
    <div className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto md:border space-y-2 p-5 rounded-b-lg md:rounded-lg bg-[#2991ee]">
      <h2 className="text-white text-sm font-bold">Link to Chat</h2>
      <p className="text-sm italic text-white">
        Share this link with your customers to start a conversation with your
        chatbot
      </p>

      <div className="flex gap-2">
        <Link
          href={url}
          className="w-full cursor-pointer hover:opacity-50"
          // target="_blank"
        >
          <Input
            value={url}
            readOnly
            className="cursor-pointer bg-background"
          />
        </Link>

        <Button
          size="sm"
          className="px-3"
          onClick={() => {
            navigator.clipboard.writeText(url);
            toast.success("Copied to clipboard");
          }}
        >
          <span className="sr-only">Copy</span>

          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default EditHeader;
