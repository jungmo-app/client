import { KeyboardEvent, useCallback, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import useDebounce from '@/hooks/useDebounce';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useSearchLocationKeyword } from '@/hooks/useQuery/useSearchLocationKeyword';

interface SearchLocationBoxProps {
  onSubmit: () => void;
}

export default function SearchLocationBox({ onSubmit }: SearchLocationBoxProps) {
  const { register, setValue, handleSubmit, watch } = useFormContext();
  const inputValue = watch('inputValue');
  const latestKeyword = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const [keyword, setKeyword] = useState<string>('');

  const handleDebounce = useCallback(() => {
    latestKeyword.current = inputValue;
  }, [inputValue]);

  const { value: debouncedKeyword } = useDebounce(inputValue, 500, handleDebounce);

  const [isViewSuggestion, setIsViewSuggestion] = useState<boolean>(false);
  const { data: suggestions } = useSearchLocationKeyword(debouncedKeyword);

  const { targetRef } = useOutsideClick<HTMLFormElement>(() => setIsViewSuggestion(false));

  const handleSubmitKeyword = () => {
    if (focusIndex !== -1) {
      setValue('inputValue', keyword);
    }
    setIsViewSuggestion(false);
    inputRef.current?.blur();
    onSubmit();
  };

  const handleClickSuggestion = (value: string) => {
    setIsViewSuggestion(false);
    setValue('inputValue', value);
    onSubmit();
  };

  const highlightMatch = (text: string, keyword: string) => {
    if (!keyword) return text;

    const remaining = keyword.split('').filter(Boolean);

    return text.split('').map((char, index) => {
      const matchIndex = remaining.indexOf(char);
      if (matchIndex !== -1) {
        remaining.splice(matchIndex, 1);

        return (
          <mark key={index} className="bg-transparent font-semibold text-yellow-200 dark:text-yellow-600">
            {char}
          </mark>
        );
      }

      return <span key={index}>{char}</span>;
    });
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions?.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      setFocusIndex(prev => {
        const index = prev + 1;
        if (index > suggestions.length - 1) {
          setKeyword(inputValue);
          return -1;
        }
        setKeyword(suggestions[index]);
        return index;
      });
    }

    if (e.key === 'ArrowUp') {
      setFocusIndex(prev => {
        const index = prev - 1;
        if (index >= -1) {
          setKeyword(index >= 0 ? suggestions[index] : inputValue);
          return index;
        }
        const lastIndex = suggestions.length - 1;
        setKeyword(suggestions[lastIndex]);
        return lastIndex;
      });
    }
  };

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
              setKeyword(e.target.value);
              setFocusIndex(-1);
              if (e.target.value) {
                setIsViewSuggestion(true);
              } else {
                setIsViewSuggestion(false);
              }
            },
          })}
          value={keyword}
          ref={e => {
            register('inputValue').ref(e);
            inputRef.current = e;
          }}
          onKeyDown={handleInputKeydown}
        />
        {suggestions && suggestions.length > 0 && isViewSuggestion && (
          <div className="absolute top-full z-[60] w-full rounded-md bg-background py-2">
            {suggestions.slice(0, 6).map((item, index) => (
              <div
                key={item}
                className={`flex h-10 w-full cursor-pointer items-center rounded-md p-4 ${index === focusIndex && 'bg-blue-50 dark:bg-gray-600'} hover:bg-blue-50 dark:hover:bg-gray-600`}
                onClick={() => handleClickSuggestion(item)}
              >
                {highlightMatch(item, debouncedKeyword)}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
