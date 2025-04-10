'use client';

import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { SessionContext } from '@/contexts/SessionProvider';
import { useLogin } from '@/hooks/useMutate/useLogin';
import { loginSchema } from '@/schemas/auth';
import { LoginRequest } from '@/types/auth';
import { ApiError } from '@/utils/error';

export default function LoginForm() {
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const handleLoginError = (error: ApiError) => {
    if (error.status === 400) {
      form.setError('email', { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
      form.setError('password', { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
      return;
    }
    alert('로그인에 실패하였습니다');
  };
  const { mutate: login, isPending, isSuccess } = useLogin({ onError: handleLoginError });

  const { closeSession } = useContext(SessionContext);

  const onSubmit = async (data: LoginRequest) => {
    login(data);
  };

  useEffect(() => {
    closeSession();
  }, [closeSession]);

  return (
    <>
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
                    autoComplete="on"
                    error={Boolean(form.formState.errors.email)}
                    clearError={() => form.clearErrors('email')}
                    readOnly={isPending}
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
                    autoComplete="new-password"
                    error={Boolean(form.formState.errors.password)}
                    clearError={() => form.clearErrors('password')}
                    type="password"
                    readOnly={isPending}
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
            disabled={isPending || isSuccess}
            aria-label="로그인"
          >
            로그인
          </Button>
        </form>
      </Form>
      <div className="relative" style={{ marginTop: '16px', marginBottom: '12px' }}>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Link href="https://jungmoserver.shop/oauth2/authorization/kakao">
        <Button
          disabled={isPending}
          variant="outline"
          aria-label="카카오톡 로그인"
          className="h-12 w-full rounded-full border-2 border-yellow-400 bg-yellow-400 font-semibold text-black hover:bg-yellow-500 dark:hover:border-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-black"
        >
          카카오로 로그인하기
        </Button>
      </Link>
    </>
  );
}
