'use client';

import { useState } from 'react';
import { apis } from '@/apis';
import { SetPasswordFormValues } from '@/types/auth';
import EmailForm from './emailForm';
import RequestInfo from './requestInfo';

export default function ResetRequest() {
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = async (data: SetPasswordFormValues) => {
    const response = await apis.auth.setPassword(data);
    if (response.status === 200) {
      setIsSubmit(true);
      return;
    }
    alert(response.message);
  };

  return <>{isSubmit ? <RequestInfo /> : <EmailForm onSubmit={handleSubmit} />}</>;
}
