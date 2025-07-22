import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import { shapes } from "@dicebear/collection";

function Avatar({
  seed,
  className,
  size,
}: {
  seed?: string;
  className?: string;
  size?: { w?: number; h?: number };
}) {
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
      className={`rounded-full ${className}`}
      alt="User avatar"
      width={size?.w || 80}
      height={size?.h || 80}
    />
  );
}

export default Avatar;
