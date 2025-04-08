import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useSearchLocationKeyword } from '@/hooks/useQuery/useSearchLocationKeyword';

interface SearchLocationBoxProps {
  onSubmit: () => void;
}

export default function SearchLocationBox({ onSubmit }: SearchLocationBoxProps) {
  const { register, setValue, handleSubmit } = useFormContext();
  const [isViewSuggestion, setIsViewSuggestion] = useState<boolean>(false);
  const [debouncedKeyword, setDeboundedKeyword] = useState<string>('');
  const { data: suggestions } = useSearchLocationKeyword(debouncedKeyword);

  const { targetRef } = useOutsideClick<HTMLFormElement>(() => setIsViewSuggestion(false));

  const handleSubmitKeyword = () => {
    setIsViewSuggestion(false);
    onSubmit();
  };

  const handleClickSuggestion = (value: string) => {
    setIsViewSuggestion(false);
    setValue('inputValue', value);
    onSubmit();
  };

  const getSuggestion = debounce(async (keyword: string) => {
    if (!keyword) {
      return;
    }

    setDeboundedKeyword(keyword);
    setIsViewSuggestion(true);
  }, 500);

  return (
    <div className="relative px-4 pb-3 pt-1">
      <form className="relative" ref={targetRef} onSubmit={handleSubmit(handleSubmitKeyword)}>
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          autoComplete="on"
          placeholder="장소를 검색해주세요"
          className="bg-background pl-8 outline-none"
          {...register('inputValue', {
            onChange: e => {
              getSuggestion(e.target.value);
            },
          })}
        />
        {suggestions && suggestions.length > 0 && isViewSuggestion && (
          <div className="absolute top-full z-[60] w-full rounded-md bg-background py-2">
            {suggestions.slice(0, 6).map(item => (
              <div
                key={item}
                className="flex h-10 w-full cursor-pointer items-center rounded-md p-4 hover:bg-blue-50 dark:hover:bg-gray-600"
                onClick={() => handleClickSuggestion(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
