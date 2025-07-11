"use client";
import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetChatbotByIdResponse } from "@/types/type";
import React, { useEffect, useState } from "react";

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
  const [characteristic, setCharacteristic] = useState("");
  useEffect(() => {
    if (data) setChatbotName(data.chatbots.name);
  }, [data]);
  function handleDelete(id: string) {
    throw new Error(id);
  }
  function handleChatbotUpdate() {}
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
        <Avatar seed={chatbotName} className="rounded-full" />

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
          <Button type="submit" disabled={!chatbotName}>
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
      <div>
        <form>
          <Input
            placeholder="Example: If customer asks for prices, provide pricing page: www.example.com/pricing"
            value={characteristic}
            onChange={(e) => setCharacteristic(e.target.value)}
          />
          <Button type="submit" disabled={!characteristic}>
            Add
          </Button>
        </form>

        <ul>
          {data?.chatbots.chatbot_characteristics.map((ele) => (
          
          ))}
        </ul>
      </div>
    </section>
  );
}

export default EditSection;
