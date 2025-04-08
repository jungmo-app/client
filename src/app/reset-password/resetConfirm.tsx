'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { usePasswordReset } from '@/hooks/useMutate/usePasswordReset';
import { resetPasswordSchema } from '@/schemas/auth';
import { ResetPasswordFormValues } from '@/types/auth';

interface ResetConfirmProps {
  token: string;
}

export default function ResetConfirm({ token }: ResetConfirmProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const { mutate: resetPassword, isPending } = usePasswordReset();

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    resetPassword({ token, ...data });
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
            disabled={isPending}
            className="h-12 w-full rounded-full bg-blue-500 font-semibold hover:bg-blue-600"
            style={{ marginTop: '42px' }}
            aria-label="비밀번호 변경"
          >
            비밀번호 변경하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
