'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  icon: string;
  href: string;
};

export const MenuItem = ({ label, icon, href }: Props) => {
  return (
    <Button
      className="h-auto px-4 py-3 flex items-center gap-3 shadow-sm rounded-lg border bg-white border-gray-100"
      asChild
    >
      <Link href={href} className="flex items-center gap-3 w-full">
        <Image src={icon} alt={label} width={20} height={20} />
        <span className="text-sm font-medium text-gray-800">
          {label}
        </span>
      </Link>
    </Button>
  );
};