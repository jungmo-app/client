export type CardTerms = {
  id: string;
  title: string;
  required: boolean;
};

export type VerificationStatus = 'idle' | 'pending' | 'success' | 'error';
