export type ClassValue = string | false | null | undefined;

/** Joins truthy class names (mini clsx, zero dependencies). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
