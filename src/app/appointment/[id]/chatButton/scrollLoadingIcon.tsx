export default function ScrollLoadingIcon() {
  return (
    <div className="relative left-1/2 top-3 flex h-8 -translate-x-1/2 items-center justify-center gap-[6px]">
      <span className="size-1 animate-bounce-up-down rounded-full bg-gray-500 [animation-delay:-0.3s] dark:bg-gray-200" />
      <span className="size-1 animate-bounce-up-down rounded-full bg-gray-500 [animation-delay:-0.15s] dark:bg-gray-200" />
      <span className="size-1 animate-bounce-up-down rounded-full bg-gray-500 dark:bg-gray-200" />
    </div>
  );
}
