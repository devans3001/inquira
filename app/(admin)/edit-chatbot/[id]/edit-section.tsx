"use client";
import Avatar from "@/components/avatar";
import Characteristic from "@/components/characteristic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ADD_CHARACTERISTIC,
  DELETE_CHATBOT,
  UPDATE_CHATBOT,
} from "@/graphql/mutations/mutation";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse } from "@/types/type";
import { useMutation } from "@apollo/client";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function EditSection({
  loading,
  id,
  data,
}: {
  id: string;
  loading: boolean;
  data: GetChatbotByIdResponse | undefined;
}) {
  const [chatbotName, setChatbotName] = useState("");

  const [DeleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: [GET_CHATBOT_BY_ID],
    awaitRefetchQueries: true,
  });
  const [updateChatbot,{loading:updateLoading}] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: [GET_CHATBOT_BY_ID],
    awaitRefetchQueries: true,
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: [GET_CHATBOT_BY_ID],
    awaitRefetchQueries: true,
  });

  const [characteristic, setCharacteristic] = useState("");

  useEffect(() => {
    if (data) setChatbotName(data?.chatbots.name);
  }, [data]);

  //handle delete chatbot
  async function handleDelete(id: string) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot"
    );

    if (!isConfirmed) return;
    try {
      const promise = DeleteChatbot({
        variables: {
          id: parseInt(id),
        },
      });

      toast.promise(promise, {
        loading: "Deleteing Chatbot...",
        success: "Chatbot Deleted Successfully",
        error: "Failed to delete chatbot",
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleChatbotUpdate(e:React.FormEvent) {
      e.preventDefault();

    try {
      const promise = updateChatbot({
        variables: {
          id:parseInt(id),
          name:chatbotName
        }
      });

      toast.promise(promise, {
        loading: "Updating...",
        success: "Chatbot Name Successfully updated",
        error: "Failed to update chatbot",
      });

      // setChatbotName("")
    } catch (err) {
      console.error(err);
    }
  }
  
  interface AddCharacteristicVariables {
    chatbot_id: number;
    content: string;
    created_at: string;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    try {
      const promise = addCharacteristic({
        variables: {
          chatbot_id: parseInt(id),
          content: characteristic,
          created_at: new Date().toISOString(),
        } as AddCharacteristicVariables,
      });

      toast.promise(promise, {
        loading: "Adding Characteristic...",
        success: "Chatbot Added Successfully",
        error: "Failed to add chatbot",
      });

      setCharacteristic("")
    } catch (err) {
      console.error(err);
    }
  }

  if (loading)
    return (
      <div className="mx-auto animate-pulse p-10">
        <Avatar seed="lol" />
      </div>
    );

  if (!data?.chatbots) return redirect("/view-chatbot");

  return (
    <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
      <Button
        variant={"destructive"}
        className="absolute top-2 right-2 "
        disabled={loading}
        onClick={() => handleDelete(id)}
      >
        X
      </Button>

      <div className="flex space-x-4">
        <Avatar seed={chatbotName} />

        <form
          onSubmit={handleChatbotUpdate}
          className="flex flex-1 space-x-2 items-center"
        >
          <Input
            value={chatbotName}
            onChange={(e) => setChatbotName(e.target.value)}
            placeholder={chatbotName}
            className="w-full border-none bg-transparent text-xl font-bold"
          />
          <Button type="submit" disabled={!chatbotName || updateLoading}>
            Update
          </Button>
        </form>
      </div>

      <h2 className="text-xl font-bold mt-10">Heres what your AI knows...</h2>
      <p>
        Your chatbot is equipped with the following information o assist you in
        your conversations with your customers & users
      </p>

      {/* CHARACTERISTICS  */}
      <div className="p-5 bg-gray-200 rounded-md mt-5">
        <form
          className="flex gap-2 my-5"
          onSubmit={handleAdd}
        >
          <Input
            placeholder="Example: If customer asks for prices, provide pricing page: www.example.com/pricing"
            value={characteristic}
            onChange={(e) => setCharacteristic(e.target.value)}
          />
          <Button type="submit" disabled={!characteristic}>
            Add
          </Button>
        </form>

        <ul className="flex flex-wrap-reverse gap-2">
          {data?.chatbots?.chatbot_characteristics?.map((ele) => (
            <Characteristic key={ele.id} ele={ele} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default EditSection;
