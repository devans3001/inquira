/* eslint-disable @typescript-eslint/no-explicit-any */
// 🚀 Force dynamic rendering since data is fetched on each request
export const dynamic = "force-dynamic";

import Messages from "@/components/messages";
import { GET_CHAT_SESSION_MESSAGES } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatSessionMessageResponse } from "@/types/type";
import React from "react";

type GetChatSessionMessageVariable = {
  id: number;
};
async function ReviewSession({ params }:any) {
  const { id } = params;

  const {
    data: {
      chat_sessions: {
        // id: chatSessionId,
        created_at,
        messages,
        guests: { name: guestName, email },
        chatbots: { name },
      },
    },
  } = await serverClient.query<
    GetChatSessionMessageResponse,
    GetChatSessionMessageVariable
  >({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: {
      id: parseInt(id),
    },
  });
  return (
    <div className="flex-1 p-10 pb-24">
      <h1 className="text-xl lg:text-3xl font-semibold">Session Review</h1>
      <p className="font-light text-sm mt-2 text-gray-400">
        Started at {new Date(created_at).toLocaleString()}
      </p>

      <h2 className="font-light mt-2">
        Between {name} &{" "}
        <span className="font-extrabold">
          {guestName} ({email})
        </span>
      </h2>

      <hr className="my-12" />

      <Messages
        messages={messages}
        name={name}
      />
    </div>
  );
}

export default ReviewSession;
