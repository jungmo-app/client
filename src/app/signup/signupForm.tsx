'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { signupSchema } from '@/schemas/auth';
import { SignupFormValues } from '@/types/auth';

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupFormValues) => {
    console.log(data);
    try {
      const response = await apis.auth.register(data);
      if (response.status === 200) {
        router.push('/');
        return;
      }
      throw new Error('api error');
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패하였습니다');
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="이름을 입력해주세요"
                  className="h-12 rounded-full border-gray-300 bg-gray-100 px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
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
          style={{ marginTop: '42px' }}
        >
          회원가입
        </Button>
      </form>
    </Form>
  );
}
