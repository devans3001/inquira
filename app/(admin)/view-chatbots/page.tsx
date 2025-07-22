import { GET_CHATBOT_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotsByUserData, GetChatbotsByUserDataVariable } from "@/types/type";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  const { data:{chatbotsByUser} } = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariable
  >({
    query: GET_CHATBOT_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });

  console.log(chatbotsByUser);
  

  return <div>ViewChatbots</div>;
}

export default ViewChatbots;
