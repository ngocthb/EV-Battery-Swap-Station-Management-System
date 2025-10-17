import Image from "next/image";

/**
 * Helper function to get initials from a name.
 * It's robust against null, undefined, or non-string inputs.
 */
const getInitials = (name: string): string => {
  // Safety check: if name is not a valid string, return a placeholder.
  if (!name || typeof name !== "string") {
    return "?";
  }

  const words = name.split(" ").filter(Boolean); // Split by space and remove empty entries

  if (words.length === 0) {
    return "?";
  }

  const firstInitial = words[0].charAt(0);
  const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0) : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

/**
 * Props for the Avatar component.
 */
interface AvatarProps {
  /** The source URL of the image. Can be an external URL. */
  src?: string | null;
  /** The full name of the user, used for generating initials as a fallback. */
  name: string;
  /** The size (width and height) of the avatar in pixels. Defaults to 32. */
  size?: number;
  /** Additional CSS classes to apply to the avatar container. */
  className?: string;
}

/**
 * A versatile Avatar component that displays an image from a URL or falls back to user initials.
 * It automatically uses a Next.js API route proxy for external images to avoid hostname configuration issues.
 */
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
          unoptimized={true} // ✅ Thêm prop này vào
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
