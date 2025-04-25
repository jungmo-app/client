import { ApiResponse } from '@/types/apis';
import { PlaceSearchDataType, PlaceSearchResult } from '@/types/map';

const responseData = <T>(value: T, status: number, message?: string, code?: string) => {
  return {
    data: value,
    message: message ?? '',
    code: code ?? 'C006',
    status,
  } as ApiResponse<T>;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword');
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const radius = url.searchParams.get('radius');
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword}&location=${lat},${lng}&radius=${radius}&key=${key}`,
      {
        method: 'GET',
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      const res = responseData(null, response.status, '지도 검색 결과를 가져올 수 없습니다', 'M002');
      return new Response(JSON.stringify(res), { status: response.status });
    }

    const { results } = await response.json();
    const r = results as PlaceSearchResult[];
    const data = r.map(({ name, geometry: { location }, formatted_address, place_id }) => ({
      name,
      location,
      formatted_address,
      place_id,
    }));
    const res = responseData<PlaceSearchDataType[]>(data, 200, '장소 검색 결과를 가져오는데 성공하였습니다');

    return new Response(JSON.stringify(res), { status: 200 });
  } catch (e) {
    const res = responseData(null, 500, '서버 오류');
    return new Response(JSON.stringify(res), { status: 500 });
  }
}
