'use client';

import { useState } from 'react';
import EmailForm from './emailForm';
import RequestInfo from './requestInfo';

export default function ResetRequest() {
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsRequestSuccess(true);
  };

  return <>{isRequestSuccess ? <RequestInfo /> : <EmailForm onSubmit={handleSubmit} />}</>;
}
