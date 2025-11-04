import Image from "next/image";

const getInitials = (name: string): string => {
  if (!name || typeof name !== "string") {
    return "?";
  }

  const words = name.split(" ").filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  const firstInitial = words[0].charAt(0);
  const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0) : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

interface AvatarProps {
  src?: string | null;

  name: string;

  size?: number;

  className?: string;
}

export function Avatar({ src, name, size = 32, className = "" }: AvatarProps) {
  const initials = getInitials(name);
  const proxySrc = src
    ? `/api/image-proxy?url=${encodeURIComponent(src)}`
    : null;

  return (
    <div
      className={`relative rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold overflow-hidden select-none ${className}`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
      aria-label={name}
    >
      {proxySrc ? (
        <Image
          src={proxySrc}
          alt={name ?? "User avatar"}
          width={size}
          height={size}
          className="object-cover"
          unoptimized={true}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
