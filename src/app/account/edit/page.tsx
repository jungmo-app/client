'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangePasswordSheet } from '@/components/account/ChangePasswordSheet';
import { DeleteAccountSheet } from '@/components/account/DeleteAccountSheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useImageUpload } from '@/hooks/useImageUpload';
import { PARTICIPANTS } from '@/mocks/appointment';
import { ChangePasswordFormValues, EditProfileFormValues, editProfileSchema } from '@/schemas/account';

export default function EditAccountPage() {
  const router = useRouter();
  const user = PARTICIPANTS[0];

  const {
    preview,
    error: imageError,
    handleImageChange,
  } = useImageUpload({
    initialImage: user.image,
    onImageChange: (file, preview) => {
      form.setValue('profileImage', file);
    },
  });

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      profileImage: undefined,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: EditProfileFormValues) => {
    console.log('Form submitted:', data);
    router.back();
  };

  const handleDeleteAccount = () => {
    console.log('Account deleted');
  };

  const handlePasswordChange = (data: ChangePasswordFormValues) => {
    console.log('Password changed:', data);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">프로필 수정</h1>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6 p-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={preview || ''} />
                <AvatarFallback>{form.watch('name')[0]}</AvatarFallback>
              </Avatar>
              <Input type="file" accept="image/*" className="hidden" id="profile-image" onChange={handleImageChange} />
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-0 rounded-full"
                type="button"
                onClick={() => document.getElementById('profile-image')?.click()}
              >
                수정
              </Button>
            </div>
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </div>

          <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" placeholder="이름을 입력해주세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="bg-white" placeholder="이메일을 입력해주세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <ChangePasswordSheet onChangePassword={handlePasswordChange} />
          <DeleteAccountSheet onDelete={handleDeleteAccount} />

          <div className="border-t p-4 fixed-mobile-bottom">
            <Button
              className="w-full"
              size="lg"
              disabled={!form.formState.isValid}
              onClick={form.handleSubmit(onSubmit)}
            >
              저장
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
