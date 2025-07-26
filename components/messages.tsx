"use client";

import { Message } from "@/types/type";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Avatar from "./avatar";
import { UserCircle } from "lucide-react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

function Messages({ messages, name }: { messages: Message[]; name: string }) {
  const pathname = usePathname();
  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    if(divRef.current){
        divRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  const isReviewSession = pathname.includes("review-sessions");
  return (
    <div className="rounded-lg py-10 px-5 space-y-10 overflow-y-auto bg-white flex-1 flex flex-col">
      {messages.map((msg) => {
        const isSender = msg.sender === "ai";

        return (
          <div
            key={msg.id}
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            {isReviewSession && (
              <p className="absolute -bottom-5 text-xs text-gray-300">
                Sent {new Date(msg.created_at).toLocaleString()}
              </p>
            )}

            <div className={`chat-image avatar w-10 ${!isSender && "-mr-4"}`}>
              {isSender ? (
                <Avatar
                  seed={name}
                  className="h-12 w-12 bg-white  border-2 border-[#2991ee]"
                />
              ) : (
                <UserCircle className="text-[#2991ee]" />
              )}
            </div>

            <div
              className={`chat-bubble  ${
                isSender
                  ? "chat-bubble-primary bg-[#4d7df8] text-white"
                  : "chat-bubble-secondary bg-gray-200 text-gray-700"
              }`}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                // className={`break-words`}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-disc list-inside ml-5 mb-5"
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal list-inside ml-5 mb-5"
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-2xl font-bold mb-5" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-xl font-bold mb-5" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-lg font-bold mb-5" />
                  ),

                  table: ({ node, ...props }) => (
                    <table
                      {...props}
                      className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5"
                    />
                  ),

                  th: ({ node, ...props }) => (
                    <th {...props} className="text-left underline" />
                  ),

                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className={`whitespace-break-spaces mb-5 ${
                        msg.content === "Thinking..." && "animate-pulse"
                      } ${isSender ? "text-white" : "text-gray-700"}`}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      className="font-bold underline hover:text-blue-400"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {msg.content}
              </Markdown>
            </div>
          </div>
        );
      })}

      <div ref={divRef}/>
    </div>
  );
}

export default Messages;
