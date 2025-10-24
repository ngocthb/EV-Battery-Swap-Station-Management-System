"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const DropdownMenuTrigger = ({
  children,
  onClick,
}: DropdownMenuTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className="focus:outline-none"
      type="button"
      aria-haspopup="true"
    >
      {children}
    </button>
  );
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

export const DropdownMenuContent = ({
  children,
  align = "start",
  className,
}: DropdownMenuContentProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle open when trigger clicked
  useEffect(() => {
    const trigger = ref.current?.previousElementSibling as HTMLElement | null;
    if (!trigger) return;
    const toggle = () => setIsOpen((prev) => !prev);
    trigger.addEventListener("click", toggle);

    const handleOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !trigger.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);

    return () => {
      trigger.removeEventListener("click", toggle);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute z-50 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1",
        align === "end" ? "right-0" : "left-0",
        isOpen ? "block" : "hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  asChild?: boolean;
  className?: string;
}

export const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: DropdownMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator = () => (
  <div className="border-t border-gray-200 my-1" />
);
