'use client';

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { ButtonContext } from '@/contexts/ButtonClickProvider';
import { useChangePassword } from '@/hooks/useMutate/useChangePassword';
import { changePasswordSchema } from '@/schemas/auth';
import { ChangePasswordFormValues } from '@/types/auth';

export default function ChangePasswordSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { isClicked, changeClick } = useContext(ButtonContext);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleSuccess = () => {
    setIsOpen(false);
    changeClick(false);
    form.reset();
  };

  const handleError = () => {
    changeClick(false);
    form.setError('oldPassword', { message: '비밀번호가 잘못되었습니다' });
  };

  const { mutate: changePassword } = useChangePassword(handleSuccess, handleError);

  const handleChangePassword = async (value: ChangePasswordFormValues) => {
    changeClick(true);
    const { oldPassword, newPassword } = value;
    changePassword({ oldPassword, newPassword });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between px-0 text-gray-500 hover:bg-transparent"
          aria-label="비밀번호 변경"
          disabled={isClicked}
        >
          <span>비밀번호 변경하기</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>비밀번호 변경</SheetTitle>
          <SheetDescription>비밀번호 변경 시트</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(handleChangePassword)}>
            <Input type="text" autoComplete="username" className="hidden" tabIndex={-1} aria-hidden="true" />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>현재 비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                      placeholder="현재 비밀번호를 입력해주세요"
                      onChange={e => {
                        field.onChange(e.target.value);
                        if (
                          e.target.value &&
                          (e.target.value === form.getValues('newPassword') || form.formState.errors.newPassword)
                        ) {
                          form.trigger('newPassword');
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {...field}
                      placeholder="새 비밀번호를 입력해주세요"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요
                  </FormDescription>
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
                      autoComplete="new-password"
                      type="password"
                      {...field}
                      placeholder="새 비밀번호를 다시 입력해주세요"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    위에서 입력한 새 비밀번호와 동일하게 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={!form.formState.isValid || isClicked} aria-label="변경">
              변경하기
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
