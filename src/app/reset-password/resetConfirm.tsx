'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/types/auth';

export default function ResetConfirm() {
  const [isClicked, setIsClicked] = useState(false);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    setIsClicked(true);
    console.log(data);
    setIsClicked(false);
  };
  return (
    <div style={{ marginTop: '8px' }}>
      <p className="text-gray-500">새로 변경할 비밀번호를 입력해주세요.</p>
      <Form {...form}>
        <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새 비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="h-12 rounded-full border-gray-300 bg-gray-100 px-4"
                    {...field}
                    placeholder="새 비밀번호를 입력해주세요"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새 비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="h-12 rounded-full border-gray-300 bg-gray-100 px-4"
                    {...field}
                    placeholder="새 비밀번호를 다시 입력해주세요"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isClicked}
            className="h-12 w-full rounded-full bg-blue-500 font-semibold text-white hover:bg-blue-600"
            style={{ marginTop: '42px' }}
          >
            비밀번호 변경하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
