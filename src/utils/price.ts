export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};
