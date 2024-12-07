import { cva } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';
import { formatAmount } from '@/utils/price';
import { cn } from '@/utils/styles';

type TotalAmountSummaryProps = {
  totalAmount: number;
  size?: 'sm' | 'lg';
};

const TotalAmountSummary = ({ totalAmount, size = 'lg' }: TotalAmountSummaryProps) => {
  return (
    <div className={cn(totalAmountVariants({ size }))}>
      <div className="flex items-center gap-3">
        <div>
          <p className={cn(amountLabelVariants({ size }))}>지출 총액</p>
          <p className={cn(amountTextVariants({ size }))}>{formatAmount(totalAmount)}원</p>
        </div>
      </div>
      {size === 'sm' && <ChevronRight className={cn(chevronIconVariants({ size }))} />}
    </div>
  );
};

const totalAmountVariants = cva('flex w-full items-center justify-between rounded-xl bg-[#F7F7F7]', {
  variants: {
    size: {
      sm: 'px-4 py-3',
      lg: 'px-5 py-4',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

const amountLabelVariants = cva('text-left font-medium text-gray-600', {
  variants: {
    size: {
      sm: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

const amountTextVariants = cva('font-semibold', {
  variants: {
    size: {
      sm: 'text-lg',
      lg: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

const chevronIconVariants = cva('text-gray-400', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      lg: 'h-5 w-5',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

export default TotalAmountSummary;
