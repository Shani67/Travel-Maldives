export const destinationTypes = ["local-island", "resort", "dive-site", "city"] as const;
export type DestinationType = (typeof destinationTypes)[number];

export const typeLabels: Record<DestinationType, string> = {
  "local-island": "Local island",
  resort: "Resort atoll",
  "dive-site": "Diving",
  city: "City",
};

/** 1 = guesthouse budget, 2 = mid-range, 3 = luxury. */
export type Budget = 1 | 2 | 3;

export const budgetLabels: Record<Budget, string> = {
  1: "Budget",
  2: "Mid-range",
  3: "Luxury",
};

export type Destination = {
  slug: string;
  name: string;
  atoll: string;
  type: DestinationType;
  budget: Budget;
  /** Decimal degrees. South of the equator is negative. */
  coordinates: { lat: number; lng: number };
  summary: string;
  description: string[];
  highlights: string[];
  /** Months (1 to 12) with the best conditions for this destination. */
  bestMonths: number[];
  gettingThere: string;
};
