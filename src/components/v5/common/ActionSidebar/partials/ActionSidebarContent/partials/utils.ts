import { format, isToday, isYesterday } from 'date-fns';

export const formatDate = (createdAt: string | undefined) => {
  if (!createdAt) {
    return null;
  }

  const utcDate = new Date(createdAt);
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000,
  );

  let formattedDate;
  if (isToday(localDate)) {
    formattedDate = 'Today at ';
  } else if (isYesterday(localDate)) {
    formattedDate = 'Yesterday at ';
  } else {
    formattedDate = `${format(localDate, 'd MMM yyyy')} at `;
  }

  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes}${amOrPm}`;

  return formattedDate + formattedTime;
};
