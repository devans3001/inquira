import { gql } from "@apollo/client";

// alwaya make sure to check the types of the query and variables

export const GET_USER_CHATBOTS = gql`
  query GetUserChatbots($userId: String!) {
    chatbotsByUser(clerk_user_id: $userId) {
      id
      name
      chat_sessions {
        id
        created_at
        guests {
          name
          email
        }
      }
      created_at
    }
  }
`;

export const GET_CHAT_SESSION_MESSAGES = gql`
 query chat_sessionsList($id: Int!) {
  chat_sessions(id: $id) {
    created_at
    id
    messages {
      content
      created_at
      id
      sender
    }
    guests {
      name
      email
    }
    chatbots {
      name
    }
  }
}
`;

export const GET_CHATBOT_BY_USER = gql`
  query GetChatbotsByUser($clerk_user_id: String!) {
    chatbotsByUser(clerk_user_id: $clerk_user_id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;
