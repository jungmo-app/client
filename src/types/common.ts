export type StrictPropsWithChildren<P = unknown> = P & {
  children: React.ReactNode;
};

export type SetAction<T> = React.Dispatch<React.SetStateAction<T>>;
export type SetActionValue<T> = React.SetStateAction<T>;
