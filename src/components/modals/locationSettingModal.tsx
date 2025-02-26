'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apis } from '@/apis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { GOOGLE_MAP_FIELD, placeTypeTranslations } from '@/constants/place';
import { Photos } from '@/types/map';

interface LocationSettingModalProps {
  isOpen: boolean;
  placeId: null | string;
  target?: (typeof GOOGLE_MAP_FIELD)[number][];
  locationData?: google.maps.places.PlaceResult;
  onClose: (entireClose?: boolean) => void;
  onSelect?: (value: google.maps.places.PlaceResult) => Promise<void> | void;
}

export default function LocationSettingModal({
  isOpen,
  locationData,
  placeId,
  target,
  onClose,
  onSelect,
}: LocationSettingModalProps) {
  const [data, setData] = useState<google.maps.places.PlaceResult | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const [isLoaded, setIsLoaded] = useState(Boolean(locationData));

  const handleClickButton = async () => {
    if (!placeId) {
      return;
    }
    if (onSelect && data) {
      await onSelect(data);
    }

    onClose(true);
  };

  useEffect(() => {
    if (locationData) {
      setData(locationData);
      return;
    }

    if (!placeId) {
      return;
    }

    const getData = async () => {
      setIsLoaded(false);
      try {
        const { data: detailData } = await apis.place.getDetail(
          placeId,
          Array.from(
            new Set(['name', 'formatted_address', 'photo', 'type', 'place_id', ...(target ?? [])])
          ) as (typeof GOOGLE_MAP_FIELD)[number][]
        );
        const locationTags = detailData.types
          ? await Promise.all(
              detailData.types.map(
                async item => placeTypeTranslations[item] ?? (await apis.place.translatePlaceType(item))
              )
            )
          : [];
        setTags(locationTags);
        setData(detailData);
        setIsLoaded(true);
      } catch {
        alert('장소 정보를 가져올 수 없습니다');
        onClose();
      }
    };
    getData();
  }, [placeId, onClose, locationData, target /*  getCache, setCache */]);

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose(false)}>
      <SheetContent side="bottom" className={`flex h-[60vh] flex-col ${onSelect && 'pb-20'}`}>
        <SheetHeader>
          <SheetTitle>장소 정보</SheetTitle>
        </SheetHeader>
        {!isLoaded ? (
          <div className="flex flex-grow items-center justify-center">
            <p>장소 데이터 가져오는 중...</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow px-2">
              <div className="mb-5 flex flex-col gap-3 pt-2">
                <div>
                  <Label className="text-neutral-400">주소</Label>
                  <div className="mt-1 p-1">
                    <Input readOnly value={data?.formatted_address} className="border-none bg-neutral-100" />
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400">장소명</Label>
                  <div className="mt-1 p-1">
                    <Input readOnly value={data?.name} />
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400">카테고리 태그</Label>
                  <div className="mt-1 flex flex-wrap items-center gap-2 p-1">
                    {tags.map((item, index) => (
                      <Button key={index} className="cursor-default" variant={index !== 0 ? 'outline' : 'default'}>
                        #{item}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400">이미지</Label>
                  <div className="mt-1 flex flex-wrap gap-2 p-1">
                    {data?.photos?.length === 0 || data?.photos === undefined ? (
                      <div className="mt-2">이미지가 없습니다</div>
                    ) : (
                      data.photos.map((photo, index) => {
                        const typedPhoto = photo as Photos;
                        return (
                          <div
                            key={index}
                            className="relative flex size-[78px] items-center justify-center overflow-hidden rounded-lg border border-solid border-neutral-300"
                          >
                            <Image
                              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${typedPhoto.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`}
                              className="size-full max-w-none object-cover"
                              alt={`Image ${index}`}
                              width={78}
                              height={78}
                              placeholder="blur"
                              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zY3JpcHQiIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiPjwvc3ZnPg=="
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            {onSelect && (
              <div className="absolute bottom-0 left-0 z-[60] flex w-full border-t border-solid border-neutral-300 p-4">
                <Button className="h-12 w-full" style={{ fontSize: '16px' }} onClick={handleClickButton}>
                  저장하기
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
