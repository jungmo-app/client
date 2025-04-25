'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@/components/common/LoadingButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import { useRequestEmail } from '@/hooks/useMutate/useRequestEmail';
import { setPasswordSchema } from '@/schemas/auth';
import { SetPasswordFormValues } from '@/types/auth';
import { ApiError } from '@/utils/error';

interface EmailFormProps {
  onSubmit: () => void;
}

export default function EmailForm({ onSubmit }: EmailFormProps) {
  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const handleSuccess = () => {
    onSubmit();
  };

  const handleError = (error: ApiError) => {
    if (error.code === 'C018') {
      alert('이메일 전송에 실패하였습니다');
      return;
    }

    if (error.code === 'C009' || error.code === 'C005') {
      form.setError('email', { message: '존재하지 않는 회원입니다' });
      return;
    }

    alert('초기화 링크 생성에 실패하였습니다');
  };

  const { mutate: requestEmail, isPending } = useRequestEmail({ onSuccess: handleSuccess, onError: handleError });

  const handleSubmit = (data: SetPasswordFormValues) => {
    requestEmail(data);
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
