import Chatbotsessions from "@/components/chatbotsessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { Chatbot } from "@/types/type";
import { auth } from "@clerk/nextjs/server";

type GetUserChatbotsVariable = {
  userId: string;
};
type GetUserChatbotsResponse = {
  chatbotsByUser: Chatbot[];
};

async function ReviewSessions() {
  const { userId } = await auth();
  if (!userId) return;

  const {
    data: { chatbotsByUser },error
  } = await serverClient.query<
    GetUserChatbotsResponse,
    GetUserChatbotsVariable
  >({
    query: GET_USER_CHATBOTS,
    variables: {
      userId,
    },
  });

  if(error) return <p>some error</p>

  //   console.table(chatbotsByUser);

  const sortChatbotByUser:Chatbot[] = chatbotsByUser.map((chatbot) => ({
    ...chatbot,
    chat_sessions: [...chatbot.chat_sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  }));

  return <div className="flex-1 px-10">
    <h1 className="mt-10 text-xl lg:text-3xl font-semibold">
        Chat Session
    </h1>
    <h2 className="mb-5">
        Review all the chat sessions the chatbot have had with your customers
    </h2>

    <Chatbotsessions chatbots={sortChatbotByUser}/>
  </div>;
}

export default ReviewSessions;
