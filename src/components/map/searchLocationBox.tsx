import { FormEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import useOutsideClick from '@/hooks/useOutsideClick';

interface SearchLocationBoxProps {
  onSubmit: () => void;
}

export default function SearchLocationBox({ onSubmit }: SearchLocationBoxProps) {
  const { register, setValue } = useFormContext();
  const [isViewSuggestion, setIsViewSuggestion] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { targetRef } = useOutsideClick<HTMLFormElement>(() => setIsViewSuggestion(false));

  const getSubstringFromOffset = (str: string, offset: number) => {
    if (offset >= str.length) return '';

    const first = str.slice(0, offset + 1);
    const last = str.slice(offset + 1);

    const indexKeyword = first.split(' ');

    return indexKeyword[indexKeyword.length - 1] + last;
  };

  const handleClickSuggestion = (value: string) => {
    setIsViewSuggestion(false);
    setValue('inputValue', value);
  };

  const handleInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsViewSuggestion(false);
    onSubmit();
  };

  const getSuggestion = debounce((keyword: string) => {
    if (!keyword) {
      setSuggestions([]);
    }
    const autoComplete = new window.google.maps.places.AutocompleteService();
    autoComplete.getPlacePredictions(
      { input: keyword, language: 'ko', types: ['establishment'], componentRestrictions: { country: 'kr' } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const placeNames = predictions
            ? predictions?.map(prediction => {
                if (prediction.matched_substrings && prediction.matched_substrings.length > 0) {
                  const matched = prediction.matched_substrings[0];
                  const matchedStartIndex = matched.offset;

                  const description = prediction.description;
                  const placeNameFromMatched = getSubstringFromOffset(description, matchedStartIndex);

                  return placeNameFromMatched;
                } else {
                  return prediction.description;
                }
              })
            : [];
          setSuggestions(Array.from(new Set(placeNames)));
          return;
        }
        setSuggestions([]);
      }
    );
  }, 500);

  return (
    <div className="relative px-4 pb-3 pt-1">
      <form className="relative" ref={targetRef} onSubmit={handleInputSubmit}>
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="장소를 검색해주세요"
          className="bg-white pl-8 outline-none"
          {...register('inputValue', {
            onChange: e => {
              if (isViewSuggestion) {
                getSuggestion(e.target.value);
                return;
              }
              setIsViewSuggestion(true);
            },
          })}
        />
        {suggestions.length > 0 && isViewSuggestion && (
          <div className="absolute top-full z-[60] w-full rounded-md bg-white py-2">
            {suggestions.slice(0, 6).map(item => (
              <div
                key={item}
                className="flex h-10 w-full cursor-pointer items-center rounded-md p-4 hover:bg-blue-50"
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
