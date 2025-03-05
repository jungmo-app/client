'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Edit, Save, X } from 'lucide-react';
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
  Label,
} from '@/components/ui';
import { useImageUpload } from '@/hooks/useImageUpload';
import { EditProfileFormValues, editProfileSchema } from '@/schemas/account';
import { UserDataResponse } from '@/types/user';

interface InfoFormProps {
  userData: UserDataResponse;
}

export default function InfoForm({ userData }: InfoFormProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState<EditProfileFormValues>({
    name: userData.userName,
    profileImage: undefined,
  });

  const {
    preview,
    error: imageError,
    handleImageChange,
  } = useImageUpload({
    initialImage: userData.profileImage,
    onImageChange: data => {
      form.setValue('profileImage', data);
    },
  });

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: data.name,
      profileImage: data.profileImage,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: EditProfileFormValues) => {
    /* if (!data.profileImage) {
      const filename;
    } */
    console.log('Form submitted:', data);
  };

  const handleClickEditButton = () => {
    setIsEditMode(true);
  };

  const handleClickCancelButton = () => {
    setIsEditMode(false);
    form.reset(data);
  };

  const handleClickSaveButton = () => {
    console.log(form.getValues());
    setData(form.getValues());
    setIsEditMode(false);
  };

  const handleClickCopyButton = async () => {
    try {
      await navigator.clipboard.writeText(userData.userCode);
      alert('클립보드에 복사하였습니다.');
    } catch {
      alert('클립보드 복사에 실패하였습니다');
    }
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
            <Label>유저 코드</Label>
            <button
              className="relative flex h-10 w-full rounded-md border border-black border-input bg-background bg-white px-3 py-2 text-sm outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              style={{ marginTop: '8px' }}
              onClick={handleClickCopyButton}
            >
              <span className="pl-6">{userData.userCode}</span>
              <div className="absolute left-3 top-1/2 size-4 -translate-y-1/2">
                <Copy className="size-4" />
              </div>
            </button>
          </Card>
        </form>
      </Form>
    </Card>
  );
}
