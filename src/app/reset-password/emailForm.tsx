'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@/components/common/LoadingButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { setPasswordSchema } from '@/schemas/auth';
import { SetPasswordFormValues } from '@/types/auth';

interface EmailFormProps {
  isPending: boolean;
  onSubmit: (data: SetPasswordFormValues) => Promise<void>;
}

export default function EmailForm({ isPending, onSubmit }: EmailFormProps) {
  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = (data: SetPasswordFormValues) => {
    onSubmit(data);
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
                  <Input type="on" className="h-12 rounded-full px-4" {...field} placeholder="이메일을 입력해주세요" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            type="submit"
            isLoading={isPending}
            loadingText="링크 생성 중"
            disabled={!form.formState.isValid || isPending}
            className={`h-12 w-full rounded-full bg-blue-500 font-semibold hover:bg-blue-600 ${isPending && 'bg-gray-400'}`}
            style={{ marginTop: '42px' }}
          >
            링크 전송하기
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
