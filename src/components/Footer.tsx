import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <div className="z-10 border-t bg-white fixed-mobile-bottom">
      <div className="p-4">
        <Button className="w-full rounded-xl" size="lg">
          장소 추가하기
        </Button>
      </div>
    </div>
  );
};

export default Footer;
