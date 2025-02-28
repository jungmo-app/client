'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { LoginRequest, loginSchema } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await apis.auth.login(data);
      router.push('/');
    } catch (error) {
      const e = error as AxiosError;
      if (e.status === 400) {
        form.setError('email', { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        form.setError('password', { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        return;
      }
      alert('로그인을 할 수 없습니다.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white p-4">
      <div className="mx-auto w-full max-w-md flex-grow space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="text-gray-500">계정 정보를 입력해주세요</p>
        </div>

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
              className="h-12 w-full rounded-full bg-blue-500 font-semibold text-white hover:bg-blue-600"
            >
              로그인
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-full border-2 border-yellow-400 bg-yellow-400 font-semibold text-black hover:bg-yellow-500"
        >
          카카오로 로그인하기
        </Button>

        <div className="text-center">
          <Link href="/signup" className="text-sm text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
