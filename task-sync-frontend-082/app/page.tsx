'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Title } from '@/components/ui';

export default function WelcomePage() {
  const router = useRouter();

  return (
     <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/background_mobile.svg" 
        alt="Background"
        fill 
        priority 
        className="object-cover z-0" 
        style={{ filter: 'blur(4px)' }} 
      />
        <div className="w-full mt-16 mb-20 flex justify-center">
          <Image
            src="/background_person.svg"
            alt="Registration illustration"
            width={240}
            height={340}
            priority
          />
        </div>
    
      <div className='w-full max-w-xs'>
        <div className="space-y-4 max-w-md">
          <Title text="Task Sync" size="lg" className="font-semibold mb-2" />
            <p className="text-secondary-foreground text-sm">
              Этот сайт-инструмент разработан для того, чтобы помочь вам лучше и удобнее управлять своими задачами в течении дня!
            </p>
        </div>

        <Button
          onClick={() => router.push('/auth/login')}
          className="mt-10 w-full shadow-2xl relative mb-10"
        >
          Начать
        </Button>
      </div>
      
    </div>
  );
}
