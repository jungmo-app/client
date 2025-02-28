export const snakeToSpace = (text: string) => {
  return text.replace(/_/g, ' ');
};

export const toLowerCamelCase = (text: string) => {
  return text
    .replace(/-([a-zA-Z])/g, (_, letter) => letter.toUpperCase()) // 하이픈 뒤 문자 대문자로 변환
    .replace(/^([A-Z])/, (_, letter) => letter.toLowerCase()); // 첫 글자가 대문자면 소문자로 변환
};

export const parseSetCookie = (value: string) => {
  const cookiePart = value.split(';').map(part => part.trim());

  const [cookieName, cookieValue] = cookiePart[0].split('=').map(part => part.trim());

  const cookieOptions = {};

  cookiePart.slice(1).forEach(option => {
    const [key, value] = option.split('=').map(s => s.trim());
    if (key === 'Domain') {
      Object.assign(cookieOptions, { [toLowerCamelCase(key)]: `.${value}` });
      return;
    }
    if (key === 'Expires') {
      Object.assign(cookieOptions, { expires: new Date(value) });
      return;
    }
    Object.assign(cookieOptions, { [toLowerCamelCase(key)]: value || true });
  });
  return { name: cookieName, value: cookieValue, options: cookieOptions };
};
