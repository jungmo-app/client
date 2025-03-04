'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Save, X } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { useImageUpload } from '@/hooks/useImageUpload';
import { PARTICIPANTS } from '@/mocks/appointment';
import { EditProfileFormValues, editProfileSchema } from '@/schemas/account';

export default function InfoForm() {
  const user = PARTICIPANTS[0];

  const [isEditMode, setIsEditMode] = useState(false);

  const {
    preview,
    error: imageError,
    handleImageChange,
  } = useImageUpload({
    initialImage: user.image,
    onImageChange: file => {
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
  };

  const handleClickEditButton = () => {
    setIsEditMode(true);
  };

  const handleClickCancelButton = () => {
    setIsEditMode(false);
  };

  const handleClickSaveButton = () => {
    setIsEditMode(false);
  };
  return (
    <Card className="relative px-3 pb-4 pt-8">
      {isEditMode ? (
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button className="group" onClick={handleClickSaveButton}>
            <Save className="size-5 stroke-neutral-400 group-hover:stroke-neutral-500" />
          </button>
          <button className="group" onClick={handleClickCancelButton}>
            <X className="size-5 stroke-neutral-400 group-hover:stroke-neutral-500" />
          </button>
        </div>
      ) : (
        <button className="group absolute right-3 top-3" onClick={handleClickEditButton}>
          <Edit className="size-5 stroke-neutral-400 group-hover:stroke-neutral-500" />
        </button>
      )}

      <Form {...form}>
        <form className="space-y-6 p-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={preview || ''} />
                <AvatarFallback>{form.watch('name')[0]}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-image"
                autoComplete="on"
                onChange={handleImageChange}
              />
              {isEditMode && (
                <button
                  className="absolute left-0 top-0 size-32 rounded-full bg-shadow-30 text-white hover:bg-shadow-50"
                  onClick={() => document.getElementById('profile-image')?.click()}
                >
                  변경
                </button>
              )}
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
                    <Input
                      {...field}
                      readOnly={!isEditMode}
                      className={`bg-white ${!isEditMode && 'cursor-default'}`}
                      placeholder="이름을 입력해주세요"
                      autoComplete="on"
                    />
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
                    <Input
                      {...field}
                      readOnly={!isEditMode}
                      className={`bg-white ${!isEditMode && 'cursor-default'}`}
                      type="email"
                      placeholder="이메일을 입력해주세요"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </form>
      </Form>
    </Card>
  );
}
