/**
 * Date utility functions for handling UTC dates and timezone conversions
 */

/**
 * Converts a UTC ISO string to local date string
 */
export const utcToLocalDate = (utcDateString: string): Date => {
  return new Date(utcDateString);
};

/**
 * Formats a UTC date string to local date display string
 */
export const formatLocalDate = (
  utcDateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(utcDateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
};

/**
 * Formats a UTC date string to local time display string
 */
export const formatLocalTime = (
  utcDateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(utcDateString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
};

/**
 * Formats a UTC date string to local date and time display string
 */
export const formatLocalDateTime = (
  utcDateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(utcDateString);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
};

/**
 * Checks if a UTC date string is in the past
 */
export const isPast = (utcDateString: string): boolean => {
  return new Date(utcDateString) < new Date();
};

/**
 * Gets the time remaining until a UTC date string
 */
export const getTimeRemaining = (utcDateString: string): {
  total: number; // milliseconds
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} => {
  const now = new Date();
  const target = new Date(utcDateString);
  const total = target.getTime() - now.getTime();

  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Formats time remaining as a human-readable string
 */
export const formatTimeRemaining = (utcDateString: string): string => {
  const remaining = getTimeRemaining(utcDateString);

  if (remaining.isExpired) {
    return "Expired";
  }

  if (remaining.days > 0) {
    return `${remaining.days}d ${remaining.hours}h`;
  }

  if (remaining.hours > 0) {
    return `${remaining.hours}h ${remaining.minutes}m`;
  }

  if (remaining.minutes > 0) {
    return `${remaining.minutes}m ${remaining.seconds}s`;
  }

  return `${remaining.seconds}s`;
};

/**
 * Converts local date and time to UTC ISO string
 * Used when creating quotes from local date/time inputs
 */
export const localToUtcISO = (localDate: string, localTime: string): string => {
  // Combine date and time in local timezone
  const localDateTime = new Date(`${localDate}T${localTime}`);
  // Return as ISO string (automatically converts to UTC)
  return localDateTime.toISOString();
};














