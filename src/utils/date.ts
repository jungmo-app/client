export const isSameMonth = (date1: Date, date2: Date) => {
  if (date1.getFullYear() !== date2.getFullYear()) {
    return false;
  }

  if (date1.getMonth() !== date2.getMonth()) {
    return false;
  }
  return true;
};

export const isSameDay = (date1: Date, date2: Date) => {
  if (!isSameMonth(date1, date2)) {
    return false;
  }

  if (date1.getDate() !== date2.getDate()) {
    return false;
  }
  return true;
};

export const isSameDateHourMinute = (date1: Date, date2: Date) => {
  if (!isSameDay(date1, date2)) {
    return false;
  }

  return date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes();
};

export const formattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formattedDateKr = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${year}년 ${pad(month)}월 ${pad(day)}일 ${dayOfWeek}요일`;
};

export const getTimeline = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 2) {
    return '방금 전';
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days < 7) {
    return `${days}일 전`;
  } else if (weeks < 4) {
    return `${weeks}주 전`;
  } else if (months < 12) {
    return `${months}달 전`;
  } else {
    return `${years}년 전`;
  }
};

export const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const isAM = hours < 12;
  const displayHours = hours % 12 || 12; // 0시를 12시로 변환
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${isAM ? '오전' : '오후'} ${displayHours}:${displayMinutes}`;
};

export const getDay = (date: Date) => {
  if (isSameDay(new Date(), date)) {
    return formatTime(date);
  }

  return formattedDate(date);
};

export const parseKST = (date: Date) => {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst;
};

export const getPrevMonthDateList = (date: Date, n: number) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  return Array.from({ length: n }, (_, i) => new Date(currentYear, currentMonth - i - 1)).reverse();
};

export const getNextMonthDateList = (date: Date, n: number) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  return Array.from({ length: n }, (_, i) => new Date(currentYear, currentMonth + i + 1));
};
