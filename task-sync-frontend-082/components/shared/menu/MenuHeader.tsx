'use client';

import Image from "next/image";
import { Title } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const MenuHeader = () => {
  const router = useRouter();

  return (
    <div className="relative flex items-center px-5 py-5 lg:py-20 lg:mt-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="absolute left-5"  
      >
        <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
      </Button>

      <Title
        text="Меню"
        size="md"
        className="mx-auto font-semibold text-center"
      />
    </div>
  );
};