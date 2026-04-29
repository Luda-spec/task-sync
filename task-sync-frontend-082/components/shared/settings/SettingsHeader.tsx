'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Title } from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';
import { toast } from 'sonner';

export const SettingsHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    
    localStorage.removeItem('accessToken');
    toast.success('Вы вышли из аккаунта');
    router.push('/auth/login');
  };

  return (
    <div className="relative flex items-center px-5 py-3 sm:py-5 mb-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="absolute left-5 top-3 sm:top-5 cursor-pointer"
      >
        <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
      </Button>

      <Title 
        text="Настройки" 
        size="md" 
        className="mx-auto font-semibold text-center" 
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-5 top-3 sm:top-5 cursor-pointer"
          >
            <Image src="/logout.svg" alt="Выйти" width={24} height={24} />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="rounded-xl"> 
          <AlertDialogHeader>
            <AlertDialogTitle>Выход</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выйти из аккаунта?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Выйти</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};