import client from "@/graphql/apolloClient";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutation";
import { gql } from "@apollo/client";

export async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatId: number
) {
  try {
    const guestResult = await client.mutate({
      mutation: gql`
        mutation insertGuest($email: String!, $name: String!) {
          insertGuests(email: $email, name: $name) {
            id
          }
        }
      `,
      variables: {
        name: guestName,
        email: guestEmail,
      },
    });

    const guestId = guestResult.data?.insertGuests.id;

    // console.log("Gust",guestId)

    const chatSessionResult = await client.mutate({
      mutation: gql`
        mutation insertChatSession($chatbot_id: Int!, $guest_id: Int!) {
          insertChat_sessions(chatbot_id: $chatbot_id, guest_id: $guest_id) {
            id
          }
        }
      `,
      variables: {
        chatbot_id: chatId,
        guest_id: guestId,
      },
    });

    const chatSessionId = chatSessionResult.data?.insertChat_sessions.id;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Welcome ${guestName} \n How can I assist you today?😃`,
      },
    });

    // console.log("New chat created successfully");

    return chatSessionId;
    
  } catch (error) {
    console.error(error);
  }
}
