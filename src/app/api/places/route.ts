import { ApiResponse } from '@/types/apis';
import { ApiError } from '@/utils/error';

const responseData = <T>(value: T, status: number, message?: string) => {
  return {
    data: value,
    message: message ?? '',
    code: 'C005',
    status,
  } as ApiResponse<T>;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const placeId = url.searchParams.get('placeId');
  const fields = url.searchParams.get('fields');
  if (!placeId || !fields) {
    return new Response(JSON.stringify(responseData(null, 400, 'placeId와 fields는 필수입니다')), { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=${fields}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&language=ko`,
      {
        method: 'GET',
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new ApiError(400, 'M001');
    }
    const { result } = await response.json();
    const res = responseData<google.maps.places.PlaceResult>(result, 200, '장소 가져오기에 성공하였습니다');

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  } catch {
    const res = responseData(null, 500, '장소 가져오기에 실패하였습니다');
    return new Response(JSON.stringify(res), { status: 500 });
  }
}
