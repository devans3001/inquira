"use client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/type";
import { useQuery } from "@apollo/client";
import EditHeader from "./edit-header";
import EditSection from "./edit-section";
import { useParams } from "next/navigation";



function EditChatbot() {

const { id } = useParams() as { id: string };

  const { data, loading } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, {
    variables: { id },
    // variables: { id:parseInt(id) },
  });

  return (
    <div className="px-0 md:p-10">
      <EditHeader id={id} />
      <EditSection id={id} loading={loading} data={data} />
    </div>
  );
}

export default EditChatbot;
