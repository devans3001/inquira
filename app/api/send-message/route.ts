import { MessagesByChatSessionIdResponse } from "@/app/(guest)/chatbot/[id]/page";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutation";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHATSESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const groq = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// for some reason open ai quota always finishes before i use it
    apiKey: process.env.GROQAI_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

//   console.log(
//     `rreceived msg from chat session ${chat_session_id}, ${chatbot_id} content: ${content} ${name}`
//   );

  try {
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: {
        id: chatbot_id,
      },
    });

    const chatbots = data.chatbots;

    if (!chatbots)
      return NextResponse.json({ error: "No chatbto found" }, { status: 404 });

    const { data: messageData } =
      await serverClient.query<MessagesByChatSessionIdResponse>({
        query: GET_MESSAGES_BY_CHATSESSION_ID,

        variables: { id: chat_session_id },
        fetchPolicy: "no-cache",
      });

    const prevMsgs = messageData?.chat_sessions.messages;

    const formattedPrevMsgs: ChatCompletionMessageParam[] = prevMsgs.map(
      (msg) => ({
        role: msg.sender === "ai" ? "system" : "user",
        name: msg.sender === "ai" ? "system" : name,
        content: msg.content,
      })
    );

    const systemPrompt = chatbots.chatbot_characteristics
      .map((ele) => ele.content)
      .join(" + ");

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they’re only allowed to search for the specified content. Use Emoji's where possible. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt}.P.s only answer questions asked, do not answer question from previous messages/chat`,
      },
      ...formattedPrevMsgs,
      {
        role: "user",
        name,
        content,
      },
    ];

    const openaiResponse = await groq.chat.completions.create({
      messages,
      model: "llama-3.1-8b-instant",
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse)
      return NextResponse.json(
        { error: "Failed to generate AI Response" },
        { status: 500 }
      );

    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content, sender: "user" },
    });

    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content: aiResponse, sender: "ai" },
    });

    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error) {
      console.error(error)
    return NextResponse.json({ error }, { status: 500 });
  }
}
