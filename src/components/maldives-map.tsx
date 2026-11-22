import { atollShapes, type Destination } from "@/lib/destinations";

const WEST = 72.6;
const NORTH = 7.25;
const SCALE = 100; // SVG units per degree

const x = (lng: number) => (lng - WEST) * SCALE;
const y = (lat: number) => (NORTH - lat) * SCALE;

type Props = {
  destinations: Destination[];
  highlight?: string;
  className?: string;
};

/**
 * A schematic map drawn from approximate atoll coordinates. It is a picture with a text
 * alternative; the destination list next to it is the accessible way to navigate.
 */
export function MaldivesMap({ destinations, highlight, className }: Props) {
  const label = highlight
    ? `Map of the Maldives showing where ${destinations.find((d) => d.slug === highlight)?.name} is`
    : `Map of the Maldives showing ${destinations.length} ${destinations.length === 1 ? "destination" : "destinations"}`;

  return (
    <svg
      viewBox={`0 0 ${1.25 * SCALE} ${8.1 * SCALE}`}
      role="img"
      aria-label={label}
      className={className}
    >
      <rect width="100%" height="100%" rx="12" className="fill-foam" />
      <line
        x1="0"
        x2="125"
        y1={y(0)}
        y2={y(0)}
        className="stroke-lagoon/40"
        strokeDasharray="3 3"
      />
      <text x="4" y={y(0) - 4} className="fill-muted text-[7px]">
        Equator
      </text>
      {atollShapes.map((atoll) => (
        <ellipse
          key={atoll.name}
          cx={x(atoll.lng)}
          cy={y(atoll.lat)}
          rx={atoll.rx * SCALE}
          ry={atoll.ry * SCALE}
          className="fill-white stroke-lagoon/50"
          strokeWidth="1"
        />
      ))}
      {destinations.map((destination) => {
        const active = destination.slug === highlight;
        const { lat, lng } = destination.coordinates;
        return (
          <g key={destination.slug}>
            <title>{destination.name}</title>
            <circle
              cx={x(lng)}
              cy={y(lat)}
              r={active ? 7 : 4.5}
              className={active ? "fill-coral stroke-white" : "fill-lagoon stroke-white"}
              strokeWidth="1.5"
            />
            {active && (
              <text
                x={x(lng) - 9}
                y={y(lat) + 3}
                textAnchor="end"
                className="fill-ocean text-[9px] font-semibold"
              >
                {destination.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
