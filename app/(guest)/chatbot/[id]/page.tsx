"use client";

import { ChatSession, GetChatbotByIdResponse, Message } from "@/types/type";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { startNewChat } from "@/lib/startNewChat";
import { toast } from "sonner";
import Avatar from "@/components/avatar";
import { useQuery } from "@apollo/client";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHATSESSION_ID,
} from "@/graphql/queries/queries";
import Messages from "@/components/messages";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebounce";

export interface MessagesByChatSessionIdResponse {
  chat_sessions: ChatSession;
}

const formSchema = z.object({
  message: z.string().min(2, "Your message is too short"),
});

function ChatbotPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const debounceEmail = useDebounce(email,800)

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEmail(value);
};

useEffect(() => {
  // only validate if something was typed
  if (debounceEmail) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/i;
    const isValid = emailRegex.test(debounceEmail);

    setIsValidEmail(isValid);

    if (!isValid) {
      toast.error("Please enter a valid Gmail or Yahoo email");
    }
  }
}, [debounceEmail]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    { variables: { id } }
  );

  const {
    // loading: loadingQuery,
    // error,
    data,
  } = useQuery<MessagesByChatSessionIdResponse>(
    GET_MESSAGES_BY_CHATSESSION_ID,
    {
      variables: { id: chatId },
      skip: !chatId,
    }
  );

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  //   console.table(messages);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;

    const message = formMessage;

    // Reset the form
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }

    if (!message.trim()) return;

    // Optimistically update the UI with the user's message
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "user",
    };

    // And show loading state for AI response
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "ai",
    };

    setMessages((prevMsg) => [...prevMsg, userMessage, loadingMessage]);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: message,
        }),
      });

      const result = await response.json();

      setMessages((prevMsg) =>
        prevMsg.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: result.content, id: result.id }
            : msg
        )
      );

      return result;
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const chatAwaitId = await startNewChat(name, email, Number(id));
    setChatId(chatAwaitId);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <div className="w-full bg-gray-100 flex">
      <Dialog onOpenChange={() => setIsOpen(false)} open={isOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Lets help you out</DialogTitle>
              <DialogDescription>
                I just need a few details to get started
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 p-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  className="col-span-3"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  className={`col-span-3 ${!isValidEmail && "border-destructive"}`}
                  placeholder="john@doe.com"
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={loading || !name || !email || !isValidEmail} type="submit">
                {!loading ? "Continue" : "loading..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#407DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avatar
            // seed={"lol"}
            seed={chatBotData?.chatbots.name}
            className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
            <p className="text-sm text-gray-300">Typically replies Instantly</p>
          </div>
        </div>

        <Messages
          messages={messages}
          name={chatBotData?.chatbots.name || "User"}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 rounded-md bg-gray-100"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <input
                      placeholder="Type a message..."
                      {...field}
                      className="p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-full"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatbotPage;
