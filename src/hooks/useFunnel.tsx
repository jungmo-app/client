import { useState } from 'react';
import { StrictPropsWithChildren } from '@/types/common';

export type StepComponentProps<T extends string> = StrictPropsWithChildren<{
  name: T;
}>;

export type FunnelComponentProps = { children: React.ReactElement[] };

export type FunnelPageProps = {
  onNext: () => void;
};

const Step = <T extends string>({ children }: StepComponentProps<T>) => {
  return <>{children}</>;
};

const useFunnel = <T extends string>(steps: readonly T[]) => {
  const [step, setStep] = useState<T>(steps[0]);

  const Funnel = ({ children }: FunnelComponentProps) => {
    if (!children) return null;

    const targetStep = children.find(childStep => childStep.props.name === step);
    if (!targetStep) return null;

    return targetStep;
  };

  Funnel.Step = Step<T>;

  return [Funnel, setStep] as const;
};

export default useFunnel;
