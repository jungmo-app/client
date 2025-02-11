import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchLocationBoxProps {
  onSubmit: () => void;
}

export default function SearchLocationBox({ onSubmit }: SearchLocationBoxProps) {
  const { register } = useFormContext();

  return (
    <div className="px-4 pb-3 pt-1">
      <form className="relative" onSubmit={onSubmit}>
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="장소를 검색해주세요" className="bg-white pl-8 outline-none" {...register('inputValue')} />
        <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" />
      </form>
    </div>
  );
}
