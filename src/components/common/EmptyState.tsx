import { PropsWithChildren } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/styles';

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

/**
 * 빈 상태를 표시하는 컴포넌트
 *
 * @param title - 제목
 * @param description - 설명
 * @param children - 자식 요소
 * @param className - 추가 스타일
 */
const EmptyState = ({ title, description, children, className }: PropsWithChildren<EmptyStateProps>) => {
  return (
    <div className={cn('flex min-h-[400px] flex-col items-center justify-center space-y-3', className)}>
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <h3 className="text-md font-medium text-accent-foreground">{title}</h3>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default EmptyState;
