'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { resetPasswordSchema } from '@/schemas/auth';
import { ResetPasswordFormValues } from '@/types/auth';

interface ResetConfirmProps {
  token: string;
}

export default function ResetConfirm({ token }: ResetConfirmProps) {
  const router = useRouter();
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
    const response = await apis.auth.resetPassword({
      token,
      newPassword: data.newPassword,
    });
    if (response?.status === 200) {
      alert('비밀번호가 변경되었습니다');
      router.push('/');
      return;
    }

    if (response?.status === 401) {
      alert('만료된 url입니다');
      router.push('/login');
      return;
    }
    alert('비밀번호 초기화에 실패하였습니다');

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
                    className="h-12 rounded-full px-4"
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
                    className="h-12 rounded-full px-4"
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
            className="h-12 w-full rounded-full bg-blue-500 font-semibold hover:bg-blue-600"
            style={{ marginTop: '42px' }}
          >
            비밀번호 변경하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
