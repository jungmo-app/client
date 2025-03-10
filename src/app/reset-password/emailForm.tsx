'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { setPasswordSchema } from '@/schemas/auth';
import { SetPasswordFormValues } from '@/types/auth';

interface EmailFormProps {
  onSubmit: () => void;
}

export default function EmailForm({ onSubmit }: EmailFormProps) {
  const [isClicked, setIsClicked] = useState(false);
  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: SetPasswordFormValues) => {
    setIsClicked(true);
    console.log(data);
    onSubmit();
    setIsClicked(false);
  };
  return (
    <div className="-mt-4">
      <p className="text-gray-500">
        가입하신 이메일 정보를 입력해주세요. <br />
        해당 이메일로 초기화 링크를 보내드립니다.
      </p>
      <Form {...form}>
        <form className="mt-12 space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="h-12 rounded-full border-gray-300 bg-gray-100 px-4"
                    {...field}
                    placeholder="이메일을 입력해주세요"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid || isClicked}
            className="h-12 w-full rounded-full bg-blue-500 font-semibold text-white hover:bg-blue-600"
            style={{ marginTop: '42px' }}
          >
            링크 전송하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
