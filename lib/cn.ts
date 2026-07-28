import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Class name composer. Used everywhere instead of inline styles. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
