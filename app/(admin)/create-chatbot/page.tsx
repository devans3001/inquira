"use client";

import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAT_BOT } from "@/graphql/mutations/mutation";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreateChatbot() {
  const { user } = useUser();

  const [name, setName] = useState("");
  const router = useRouter()

  const [createChatbot, {  loading }] = useMutation(CHAT_BOT, {
    variables: {
      clerk_user_id: user?.id,
      name,
       created_at: new Date().toISOString(), // ISO format required
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const data = await createChatbot()
      setName("")
      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`)
    } catch (err) {
      console.error("Error creating chatbot:", err);
    }
  };

  if(!user) return null;


  return (
    <div className="flex flex-col items-center justify-center md:flex-row bg-white p-10 rounded-md m-10 md:space-x-10">
      <Avatar seed="create-chatebot" />

      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers
        </h2>

        <form className="flex flex-col md:flex-row gap-2 mt-5" onSubmit={handleSubmit}>
          <Input
            placeholder="Chatbot Name..."
            className="max-w-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button disabled={loading || !name}>
            {loading ? "Creating..." : "Create Chatbot"}
          </Button>
        </form>

        <p className="text-gray-300 mt-5">Example: Customer Supprt Chatbot</p>
      </div>
    </div>
  );
}

export default CreateChatbot;
