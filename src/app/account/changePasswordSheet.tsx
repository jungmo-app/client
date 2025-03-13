'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { apis } from '@/apis';
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { changePasswordSchema } from '@/schemas/auth';
import { ChangePasswordFormValues } from '@/types/auth';

export default function ChangePasswordSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleChangePassword = async (value: ChangePasswordFormValues) => {
    const response = await apis.auth.changePassword({
      oldPassword: value.oldPassword,
      newPassword: value.newPassword,
    });

    if (response) {
      alert('비밀번호를 변경하였습니다');
      setIsOpen(false);
      return;
    }
    if (response === null) {
      form.setError('oldPassword', { message: '비밀번호가 잘못되었습니다' });
    }
    alert('비밀번호 변경에 실패하였습니다.');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between px-0 text-gray-500 hover:bg-transparent">
          <span>비밀번호 변경하기</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>비밀번호 변경</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(handleChangePassword)}>
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>현재 비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="현재 비밀번호를 입력해주세요" />
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
                    <Input type="password" {...field} placeholder="새 비밀번호를 입력해주세요" />
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
                    <Input type="password" {...field} placeholder="새 비밀번호를 다시 입력해주세요" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    위에서 입력한 새 비밀번호와 동일하게 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
              변경하기
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
