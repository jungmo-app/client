import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { placeId, fields } = await req.json();

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=${fields}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&language=ko`
    );

    return new Response(JSON.stringify(response.data.result), { status: 200 });
  } catch {
    return new Response('Error', { status: 500 });
  }
}
