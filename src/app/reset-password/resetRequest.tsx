'use client';

import { useRequestEmail } from '@/hooks/useMutate/useRequestEmail';
import { SetPasswordFormValues } from '@/types/auth';
import EmailForm from './emailForm';
import RequestInfo from './requestInfo';

export default function ResetRequest() {
  const { mutate: requestEmail, isSuccess, isPending } = useRequestEmail();

  const handleSubmit = async (data: SetPasswordFormValues) => {
    requestEmail(data);
  };

  return <>{isSuccess ? <RequestInfo /> : <EmailForm isPending={isPending} onSubmit={handleSubmit} />}</>;
}
