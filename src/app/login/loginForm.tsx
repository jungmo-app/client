'use client';

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { apis } from '@/apis';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { NotificationContext } from '@/contexts/NotificationProvider';
import { loginSchema } from '@/schemas/auth';
import { LoginRequest } from '@/types/auth';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  const { changeNotification } = useContext(NotificationContext);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsPending(true);
    try {
      const response = await apis.auth.login(data);
      if (response?.status === 400) {
        form.setError('email', { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        form.setError('password', { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        return;
      }
      if (response?.status === 200) {
        const res = await apis.notification.getNotification();
        if (res?.data) {
          changeNotification(res.data);
        }
        const refer = params.get('refer');
        router.push(`/${refer ?? ''}`);
        router.refresh();
        return;
      }
      throw new Error('api Error');
    } catch {
      alert('로그인을 할 수 없습니다.');
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  error={Boolean(form.formState.errors.email)}
                  clearError={() => form.clearErrors('email')}
                  placeholder="이메일을 입력해주세요"
                  className="h-12 rounded-full border-gray-300 bg-gray-100 px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  error={Boolean(form.formState.errors.password)}
                  clearError={() => form.clearErrors('password')}
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  className="h-12 rounded-full border-gray-300 bg-gray-100 px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-blue-500 font-semibold text-white hover:bg-blue-600 dark:bg-gray-500 dark:hover:bg-gray-700"
          style={{ marginTop: '24px' }}
          disabled={isPending}
        >
          로그인
        </Button>
      </form>
    </Form>
  );
}
