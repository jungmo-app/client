'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AppointmentList() {
  const APPOINTMENT_DATA = [
    {
      id: 1,
      title: '프로젝트 오프라인 회의',
      datetime: '2024.11.27 13:00',
      description: '와이어프레임 완성하기',
      image: 'https://picsum.photos/id/517/200/200',
      totalAmount: 100000,
      location: {
        name: '이마트 용산점',
        address: '서울 용산구 한강대로23길 55',
      },
    },
    {
      id: 2,
      title: '프로젝트 오프라인 회의2',
      datetime: '2024.11.27 13:00',
      description: '와이어프레임 완성하기',
      image: 'https://picsum.photos/id/513/200/200',
      totalAmount: 100000,
      location: {
        name: '이마트 용산점',
        address: '서울 용산구 한강대로23길 55',
      },
    },
  ];
  return (
    <div className="space-y-4">
      {APPOINTMENT_DATA.map(trip => (
        <Link key={trip.id} href={`/appointment/${trip.id}`} className="flex items-center gap-4 p-2">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
            <Image fill src={trip.image} alt={trip.title} className="object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{trip.title}</h4>
            <p className="text-sm text-muted-foreground">{trip.datetime}</p>
            <p className="text-sm text-muted-foreground">{trip.location.name}</p>
          </div>
          <Button variant="ghost" size="icon">
            <span className="sr-only">More options</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </Link>
      ))}
    </div>
  );
}
