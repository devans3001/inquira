import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import { shapes } from "@dicebear/collection";

function Avatar({ seed, className }: { seed: string; className?: string }) {
  const avatar = createAvatar(shapes, {
    seed,
  });

  const svg = avatar.toString();

  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;

  return (
    <Image
      src={dataUrl}
      className={className}
      alt="User avatar"
      width={80}
      height={80}
    />
  );
}

export default Avatar;
