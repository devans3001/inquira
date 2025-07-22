"use client"
import { REMOVE_CHARACTERISTIC } from "@/graphql/mutations/mutation";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { ChatbotCharacteristic } from "@/types/type";
import { useMutation } from "@apollo/client";
import { CircleX  } from "lucide-react";
import { toast } from "sonner";

function Characteristic({ ele }: { ele: ChatbotCharacteristic }) {
  const [RemoveCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    //when using refetchQueries, its advisable to add the names with the query obj method
    // i.e instead of  refetchQueries: [ {query:GET_CHATBOT_BY_ID} ] you use  refetchQueries: [ GET_CHATBOT_BY_ID ]
    refetchQueries: [ GET_CHATBOT_BY_ID ],
  });

  const handleDeleteCharacteristic = async () => {
    try {
      await RemoveCharacteristic({
        variables: {
          id: ele.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li key={ele.id} className="relative p-10 bg-white border rounded-md">
      <p>{ele.content}</p>
      <CircleX 
        className="w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={()=>{
          const promise = handleDeleteCharacteristic()

          toast.promise(promise,{
            loading:"Removing...",
            success:"Characteristic Removed",
            error:"Failed to remove characteristic"
          })
        }}
      />
    </li>
  );
}

export default Characteristic;
