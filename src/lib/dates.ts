/** Today's date in the Maldives (UTC+5, no daylight saving), as YYYY-MM-DD. */
export function todayInMaldives(now = new Date()): string {
  return new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
