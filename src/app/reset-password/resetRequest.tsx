'use client';

import { useState } from 'react';
import EmailForm from './emailForm';
import RequestInfo from './requestInfo';

export default function ResetRequest() {
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = () => {
    setIsSubmit(true);
  };

  return <>{isSubmit ? <RequestInfo /> : <EmailForm onSubmit={handleSubmit} />}</>;
}
