import type { DestinationType } from "@/lib/destinations";

const paths: Record<DestinationType, string> = {
  // Palm tree
  "local-island":
    "M12 22v-9m0 0c-3-4-7-4-9-2m9 2c3-4 7-4 9-2M12 13c-1-4-4-6-7-6m7 6c1-4 4-6 7-6M4 22h16",
  // Overwater villa
  resort: "M3 11l9-6 9 6M5 10v6h14v-6M7 16v5m10-5v5M2 21h20",
  // Diving mask
  "dive-site": "M3 9h18v5a3 3 0 0 1-3 3h-2l-2-2h-4l-2 2H6a3 3 0 0 1-3-3V9zm9 0V5",
  // Buildings
  city: "M4 21V9l5-3v15m0 0V4l6 3v14m0 0V11l5 2v8M2 21h20",
};

export function TypeIcon({ type, className }: { type: DestinationType; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[type]} />
    </svg>
  );
}
