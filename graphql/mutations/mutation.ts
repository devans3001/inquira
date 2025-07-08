import { gql } from "@apollo/client";


// thank God, the Apollo error was fixed by including and adding the corrrect date type for created_at

export const CHAT_BOT = gql`
  mutation CreateChatbot($clerk_user_id: String!, $name: String!, $created_at: DateTime!) {
    insertChatbots(clerk_user_id: $clerk_user_id, name: $name, created_at: $created_at) {
      id
      name
    }
  }
`;
