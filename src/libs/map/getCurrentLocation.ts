import { Position } from '@/types/map';

export const getCurrentLocation = (): Promise<null | Position> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return resolve(null);
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude: lat, longitude: lng } = position.coords;
        resolve({ lat, lng });
      },
      () => {
        reject('위치를 가져올 수 없습니다.');
      }
    );
  });
};
