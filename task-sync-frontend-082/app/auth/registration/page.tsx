'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Button, Input, Title } from '@/components/ui';
import { AuthAPI } from '@/api/auth.api';

export default function RegistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading('Регистрация...');

    try {
      const { data } = await AuthAPI.register(email, password, name);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      toast.success('Регистрация успешна! Добро пожаловать!', {
        id: loadingToast,
        duration: 3000,
      });

      router.push('/auth/login');
      
    } catch (error: unknown) {
      let message = 'Ошибка регистрации';

      if (error instanceof AxiosError) {
        const serverMessage = error.response?.data?.message;
        message = Array.isArray(serverMessage)
          ? serverMessage[0]
          : serverMessage || message;
      }

      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-full mt-16 mb-20 flex justify-center">
        <Image
          src="/background_person.svg"
          alt="Иллюстрация регистрации"
          width={240}
          height={340}
          priority
        />
      </div>

      <Title
        text="Регистрация"
        size="lg"
        className="font-semibold mb-4"
      />

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3" noValidate>
        <Input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-7.5 text-foreground"
          disabled={isLoading}
          required
        />

        <Input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-7.5 text-foreground"
          disabled={isLoading}
          required
        />

        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-7.5 text-foreground"
          disabled={isLoading}
          required
          minLength={6}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 shadow-2xl relative"
        >
          <span className="absolute left-1/2 -translate-x-1/2">
            {isLoading ? 'Загрузка…' : 'Зарегистрироваться'}
          </span>
          <Image
            src="/arrow_left.svg"
            alt="Стрелка"
            width={24}
            height={24}
            className="ml-auto"
          />
        </Button>
      </form>

      <button
        onClick={() => router.push('/auth/login')}
        className="mt-4 text-primary hover:underline font-normal text-sm mb-10"
      >
        Уже есть аккаунт? Войти
      </button>
    </div>
  );
}