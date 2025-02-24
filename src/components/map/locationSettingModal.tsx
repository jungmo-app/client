'use client';

import { ForwardedRef, useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Image from 'next/image';
import { apis } from '@/apis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { placeTypeTranslations } from '@/constants/place';
import { getCacheAtom, setCacheAtom } from '@/stores/place';

interface LocationSettingModalProps {
  placeId: null | string;
  mapRef: ForwardedRef<google.maps.Map | undefined>;
  onClose: (entireClose?: boolean) => void;
  onSelect: (address: { id: string; address: string }) => void;
}

interface PlaceDataType {
  images: string[];
  address: string;
  name: string;
  tags: string[];
}

export default function LocationSettingModal({ mapRef, placeId, onClose, onSelect }: LocationSettingModalProps) {
  const getCache = useAtom(getCacheAtom)[0];
  const setCache = useSetAtom(setCacheAtom);

  const [data, setData] = useState<PlaceDataType>({
    images: [],
    address: '',
    name: '',
    tags: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const handleClickButton = () => {
    if (!placeId) {
      return;
    }
    onSelect({ id: placeId, address: data.address });
    onClose(true);
  };

  useEffect(() => {
    if (!mapRef || !placeId || !('current' in mapRef && mapRef.current)) {
      return;
    }

    const cachedData = getCache(placeId);

    if (cachedData) {
      setData(cachedData);
      setIsLoaded(true);
      return;
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request = {
      placeId,
      fields: ['name', 'formatted_address', 'photos', 'types'],
    };

    service.getDetails(request, async (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const tags = result?.types
          ? await Promise.all(
              result.types.map(async item => {
                if (placeTypeTranslations[item]) {
                  return placeTypeTranslations[item];
                }
                const translatedText = (await apis.place.translatePlaceType(item)) ?? '';
                return translatedText;
              })
            )
          : [];
        console.log(tags);
        const placeData = {
          images: result?.photos ? result.photos.map(photo => photo.getUrl({ maxWidth: 100, maxHeight: 100 })) : [],
          address: result?.formatted_address ?? '',
          name: result?.name ?? '',
          tags,
        };
        setData(placeData);
        setIsLoaded(true);
        setCache({ placeId, data: placeData });
      }
    });
  }, [placeId, mapRef, getCache, setCache]);

  useEffect(() => {
    if (!placeId) {
      setIsLoaded(false);
    }
  }, [placeId]);

  return (
    <Sheet open={Boolean(placeId)} onOpenChange={onClose}>
      <SheetContent side="bottom" className="flex h-[60vh] flex-col pb-20">
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
                    <Input readOnly value={data.address} className="border-none bg-neutral-100" />
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400">장소명</Label>
                  <div className="mt-1 p-1">
                    <Input readOnly value={data.name} />
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400">카테고리 태그</Label>
                  <div className="mt-1 flex flex-wrap items-center gap-2 p-1">
                    {data.tags.map((item, index) => (
                      <Button key={index} className="cursor-default" variant={index !== 0 ? 'outline' : 'default'}>
                        #{item}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400">이미지</Label>
                  <div className="mt-1 flex flex-wrap justify-between gap-2 p-1">
                    {data.images.length === 0 ? (
                      <div className="mt-2">이미지가 없습니다</div>
                    ) : (
                      data.images.map((photoUrl, index) => (
                        <div
                          key={index}
                          className="relative flex size-[78px] items-center justify-center overflow-hidden rounded-lg border border-solid border-neutral-300"
                        >
                          <Image
                            src={photoUrl}
                            className="size-full max-w-none object-cover"
                            alt={`Image ${index}`}
                            width={78}
                            height={78}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zY3JpcHQiIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiPjwvc3ZnPg=="
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 z-[60] flex w-full border-t border-solid border-neutral-300 p-4">
              <Button className="h-12 w-full" style={{ fontSize: '16px' }} onClick={handleClickButton}>
                저장하기
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
