"use client";
import { Chatbot } from "@/types/type";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Avatar from "./avatar";
import Link from "next/link";
import ReactTimeago from "react-timeago";

function Chatbotsessions({ chatbots }: { chatbots: Chatbot[] }) {
  const [sortedArr, setSortedArr] = useState<Chatbot[]>(chatbots);

// console.table(sortedArr)

  useEffect(() => {
    const data = [...chatbots].sort(
      (a, b) => b.chat_sessions.length - a.chat_sessions.length
    );

    setSortedArr(data);
  }, [chatbots]);
  return (
    <div className="bg-white">
      <Accordion type="single" collapsible>
        {sortedArr.map((session) => {
          const hasSession = session.chat_sessions.length > 0;
          return (
            <AccordionItem
              key={session.id}
              value={`$item-${session.id}`}
              className="px-10 py-5"
            >
              {hasSession ? (
                <>
                  <AccordionTrigger>
                    <div className="text-left flex items-center w-full">
                      <Avatar seed={session.name} className="w-10 h-10 mr-4" />
                      <div className="flex flex-1 justify-between space-x-4">
                        <p>{session.name}</p>
                        <p className="pr-4 font-bold text-right">
                          {session.chat_sessions.length} session
                          {session.chat_sessions.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 p-5 bg-gray-100 rounded-md">
                    {session.chat_sessions.map((sess) => (
                      <Link
                        href={`/review-sessions/${sess.id}`}
                        key={sess.id}
                        className="relative p-10 text-white  rounded-md block bg-[#2991ee]"
                      >
                        <p className="text-lg font-bold">
                          {sess.guests?.name || "Anonymous"}
                        </p>
                        <p className="text-sm font-light">
                          {sess.guests?.email || "No email provided"}
                        </p>
                        <p className="text-sm absolute top-5 right-5">
                        <ReactTimeago date={new Date(sess.created_at)}/>
                        </p>
                      </Link>
                    ))}
                  </AccordionContent>
                </>
              ) : (
                <p className="font-light">{session.name} (No session)</p>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default Chatbotsessions;
