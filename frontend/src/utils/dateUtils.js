/**
 * Simple date formatter
 * @param {Date} date - The date to format
 * @param {string} formatStr - The format string
 * @returns {string} Formatted date string
 *
 * Format options:
 * - YYYY: 4-digit year
 * - MM: 2-digit month
 * - MMM: 3-letter month abbreviation
 * - MMMM: Full month name
 * - DD: 2-digit day
 * - D: Day without leading zero
 * - dddd: Full day name
 * - h: Hour (12-hour) without leading zero
 * - hh: Hour (12-hour) with leading zero
 * - H: Hour (24-hour) without leading zero
 * - HH: Hour (24-hour) with leading zero
 * - mm: Minutes with leading zero
 * - ss: Seconds with leading zero
 * - A: AM/PM
 */
export const format = (date, formatStr) => {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const padZero = num => (num < 10 ? `0${num}` : `${num}`);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  return formatStr
    .replace('YYYY', year)
    .replace('MM', padZero(month + 1))
    .replace('MMMM', months[month])
    .replace('MMM', months[month].substring(0, 3))
    .replace('DD', padZero(day))
    .replace('D', day)
    .replace('dddd', days[dayOfWeek])
    .replace('ddd', days[dayOfWeek].substring(0, 3))
    .replace('hh', padZero(hours12))
    .replace('h', hours12)
    .replace('HH', padZero(hours24))
    .replace('H', hours24)
    .replace('mm', padZero(minutes))
    .replace('m', minutes)
    .replace('ss', padZero(seconds))
    .replace('s', seconds)
    .replace('A', ampm);
};
