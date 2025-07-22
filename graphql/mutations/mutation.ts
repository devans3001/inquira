import { gql } from "@apollo/client";

// thank God, the Apollo error was fixed by including and adding the corrrect date type for created_at

export const CHAT_BOT = gql`
  mutation CreateChatbot(
    $clerk_user_id: String!
    $name: String!
    $created_at: DateTime!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      name: $name
      created_at: $created_at
    ) {
      id
      name
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($id: Int!) {
    deleteChatbot_characteristics(id: $id) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbots($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;
export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbots($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $content: String!
    $chatbot_id: Int!
    $created_at: DateTime!
  ) {
    insertChatbot_characteristics(
      content: $content
      created_at: $created_at
      chatbot_id: $chatbot_id
    ) {
      chatbot_id
    }
  }
`;
