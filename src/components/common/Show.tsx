import { StrictPropsWithChildren } from '@/types/common';
import LoadingIcon from './loadingIcon';

type ShowProps = {
  when: boolean;
  fallback?: React.ReactNode;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
};

const Show = ({ when, children, fallback, loading, loadingComponent }: StrictPropsWithChildren<ShowProps>) => {
  if (loading) return loadingComponent || <LoadingIcon />;
  if (!when) return fallback || null;
  return <>{children}</>;
};

export default Show;
