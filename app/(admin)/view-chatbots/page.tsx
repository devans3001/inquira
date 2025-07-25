import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { GET_CHATBOT_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetChatbotsByUserData,
  GetChatbotsByUserDataVariable,
} from "@/types/type";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  const {
    data: { chatbotsByUser },
  } = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariable
  >({
    query: GET_CHATBOT_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });

  const sortedChatbotsByUser: Chatbot[] = [...chatbotsByUser].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

    // console.log(sortedChatbotsByUser)

  return (
    <div className=" flex-1 pb-20 p-10">
      <h1 className="text-xl lg:text-3xl font-semibold mb-5">
        Active Chatbots
      </h1>

      {sortedChatbotsByUser.length === 0 && (
        <div>
          <p>
            You have not created any chatbot yet. Click on the button below to
            create one
          </p>

          <Link href="/create-chatbot">
            <Button className="rounded-md text-white p-3 mt-5 bg-[#64b5f5]">
              Create Chatbot
            </Button>
          </Link>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {sortedChatbotsByUser.map((ele) => (
          <Link key={ele.id} href={`/edit-chatbot/${ele.id}`}>
            <li className="relative p-10 border rounded-md max-w-3xl bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar seed={ele.name} />

                  <h2 className="text-xl font-bold">{ele.name}</h2>
                </div>

                <p className="absolute top-5 right-5 text-xs text-gray-500">
                  Created: {new Date(ele.created_at).toLocaleDateString()}
                </p>
              </div>

              <hr className="mt-2" />

              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <h3 className="italic">Characteristics</h3>
                <ul className="text-xs">
                  {!ele.chatbot_characteristics.length && (
                    <p>No Characteristics added yet</p>
                  )}

                  {ele.chatbot_characteristics.map((cha) => (
                    <li className="list-disc break-words" key={cha.id}>
                      {cha.content}
                    </li>
                  ))}
                </ul>

                <h3 className="italic">No of Sessions:</h3>
                <p>{ele.chat_sessions.length || 0}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatbots;
