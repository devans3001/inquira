import { Button } from "@/components/ui/button";
import Link from "next/link";

function Home() {
  return (
    <main className="p-10 bg-white m-10 rounded-md w-full">
      <h1 className="text-4xl font-light">
        Welcome to <span className="font-semibold text-[#64b5f5]">Inquira</span>
      </h1>
      <h2 className="mt-2 mb-10">
        Your customizable Ai chat agent that helps you manage your customers
        conversations.
      </h2>

      <Link href={"/create-chatbot"}>
        <Button className=" bg-[#64b5f5]">
          Lets get started by creating your first chatbot
        </Button>
      </Link>
    </main>
  );
}

export default Home;
