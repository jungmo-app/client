'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Edit, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingIcon from '@/components/common/loadingIcon';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
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
import { useEditAccount } from '@/hooks/useMutate/useEditAccount';
import { useUserData } from '@/hooks/useQuery/useUserData';
import { EditProfileFormValues, editProfileSchema } from '@/schemas/auth';

export default function InfoForm() {
  const router = useRouter();
  const { data: userData } = useUserData();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const { mutate: editAccount, isPending } = useEditAccount();

  const {
    preview,
    file,
    error: imageError,
    handleImageChange,
    resetImage,
  } = useImageUpload({
    initialImage: userData?.profileImage,
  });

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      userName: userData?.userName ?? '',
      profileImage: undefined,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!userData) {
      router.push(`/login?date=${Date.now()}`);
    }
  }, [router, userData]);

  if (!userData) {
    return (
      <div className="flex size-full flex-grow items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  const onSubmit = async (data: EditProfileFormValues) => {
    console.log(data);
    editAccount({ ...data, profileImage: file, preview });
  };

  const handleClickEditButton = () => {
    setIsEditMode(true);
  };

  const handleClickCancelButton = () => {
    setIsEditMode(false);
    resetImage();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    form.reset({ userName: userData?.userName ?? '', profileImage: undefined });
  };

  const handleClickCopyButton = async () => {
    try {
      await navigator.clipboard.writeText(userData?.userCode ?? '');
      alert('클립보드에 복사하였습니다.');
    } catch {
      alert('클립보드 복사에 실패하였습니다');
    }
  };
  return (
    <Card className="relative mx-4 pb-4 pt-8">
      <Form {...form}>
        <form className="space-y-6 p-4" onSubmit={form.handleSubmit(onSubmit)}>
          {isEditMode ? (
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button type="submit" className="group select-none" aria-label="저장" disabled={isPending}>
                <Save className="size-5 stroke-neutral-400 group-hover:stroke-neutral-500" />
              </button>
              <button className="group select-none" type="button" aria-label="취소" onClick={handleClickCancelButton}>
                <X className="size-5 stroke-neutral-400 group-hover:stroke-neutral-500" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="group absolute right-3 top-3 select-none"
              aria-label="편집"
              onClick={handleClickEditButton}
            >
              <Edit className="size-5 stroke-neutral-400 group-hover:stroke-neutral-500" />
            </button>
          )}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={preview || ''} />
                <AvatarFallback>{form.watch('userName')}</AvatarFallback>
              </Avatar>
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-image"
                autoComplete="on"
                onChange={handleImageChange}
              />
              {isEditMode && (
                <button
                  className="absolute left-0 top-0 size-32 select-none rounded-full bg-shadow-30 text-white hover:bg-shadow-50"
                  type="button"
                  aria-label="변경"
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
              name="userName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditMode}
                      className={`bg-background ${!isEditMode && 'cursor-default'}`}
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
            <Button
              className="relative flex w-full border border-input bg-background"
              type="button"
              variant="ghost"
              style={{ marginTop: '8px', justifyContent: 'normal' }}
              aria-label="유저코드 복사"
              onClick={handleClickCopyButton}
            >
              <span className="pl-6">{userData?.userCode}</span>
              <div className="absolute left-3 top-1/2 size-4 -translate-y-1/2">
                <Copy className="size-4" />
              </div>
            </Button>
          </Card>
        </form>
      </Form>
    </Card>
  );
}
