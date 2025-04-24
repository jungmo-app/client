'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { useRegister } from '@/hooks/useMutate/useRegister';
import { signupSchema } from '@/schemas/auth';
import { SignupFormValues } from '@/types/auth';
import { ApiError } from '@/utils/error';

export default function SignupForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleError = (error: ApiError) => {
    if (error.code === 'C008') {
      form.setError('email', {
        message: '이미 존재하는 이메일입니다',
      });
      return;
    }
    alert('회원가입에 실패하였습니다');
  };

  const { mutate: register, isPending } = useRegister({ onError: handleError });

  const onSubmit = async (data: SignupFormValues) => {
    register(data);
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
                  autoComplete="on"
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
                  autoComplete="on"
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
                  autoComplete="new-password"
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
          disabled={isPending || Object.keys(form.formState.errors).length > 0 || !form.formState.isValid}
          aria-label="회원가입"
        >
          회원가입
        </Button>
      </form>
    </Form>
  );
}
