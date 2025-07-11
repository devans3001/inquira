import { Button } from "./ui/button";

function Characteristic({ele}{ele: ChatbotCharacteristic }) {
  return (
    <li key={ele.id} className="flex justify-between">
      <p>{ele.content}</p>
      <Button variant={"destructive"} className="px-3">
        X
      </Button>
    </li>
  );
}

export default Characteristic;
