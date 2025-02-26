'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import * as z from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';

const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().min(1, '이메일을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Z]/, { message: '비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.' })
    .regex(/[a-z]/, { message: '비밀번호에는 최소 하나의 소문자가 포함되어야 합니다.' })
    .regex(/[\W_]/, { message: '비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.' }),
  profilePicture: z.instanceof(File).optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  /* const [profilePreview, setProfilePreview] = useState<string | null>(null); */

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
  };

  /* const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('profilePicture', file);
    }
  }; */

  return (
    <div className="flex min-h-screen flex-col bg-white p-4">
      <div className="mb-6">
        <Link href="/login">
          <ArrowLeftIcon className="h-6 w-6 text-gray-400" />
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md flex-grow space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-gray-500">계정 정보를 입력해주세요</p>
        </div>

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
            >
              회원가입
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
