import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Plus, Minus, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import Card from "./Card";
import { useCountryAnalytics } from "../../hooks/dashboard/useCountryAnalytics";

// Using the same reliable source as before, but with a confirmed working URL
const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

const colorRotation = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-400",
];

// const decorativeHighlights: Record<string, string> = {
//   // ISO Numeric IDs for countries because world-atlas uses numeric IDs
//   "840": "#fbbf24", // USA
//   "076": "#f43f5e", // BRA
//   "566": "#10b981", // NGA
//   "156": "#a855f7", // CHN
//   "360": "#3b82f6", // IDN
//   "124": "#fbbf24", // CAN (if stats fail by name)
//   "818": "#f43f5e", // EGY
//   "276": "#3b82f6", // DEU
// };

const badgeColorMap: Record<
  string,
  { text: string; border: string; bg: string }
> = {
  "bg-orange-400": {
    text: "text-orange-600",
    border: "border-orange-200",
    bg: "bg-orange-50",
  },
  "bg-rose-500": {
    text: "text-rose-600",
    border: "border-rose-200",
    bg: "bg-rose-50",
  },
  "bg-blue-500": {
    text: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
  "bg-emerald-500": {
    text: "text-emerald-600",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
  },
  "bg-purple-500": {
    text: "text-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
  },
};

function CountryProgessItem({
  country,
  color,
  percentage,
}: {
  country: string;
  color: string;
  percentage: string;
}) {
  const badgeStyles = badgeColorMap[color] || {
    text: "text-slate-600",
    border: "border-slate-200",
    bg: "bg-slate-50",
  };

  return (
    <div className="space-y-3 py-4 border-b border-slate-50 last:border-0 relative z-10">
      <div className="flex justify-between items-center">
        <span className="text-[18px] text-slate-400">{country}</span>
        <div
          className={cn(
            "px-3 py-1 rounded-lg border text-[12px] font-bold",
            badgeStyles.text,
            badgeStyles.border,
            badgeStyles.bg,
          )}
        >
          {percentage}
        </div>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            color,
          )}
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}

export function MemberJoiningsCard({ className }: { className?: string }) {
  const { data: analyticsResponse, isLoading, error } = useCountryAnalytics();
  const [position, setPosition] = useState({
    coordinates: [10, 20],
    zoom: 1.5,
  });

  if (isLoading) {
    return (
      <Card
        className={cn(
          "lg:col-span-2 min-h-[400px] flex items-center justify-center",
          className,
        )}
        title="Member Joinings"
      >
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={cn(
          "lg:col-span-2 min-h-[400px] flex items-center justify-center",
          className,
        )}
        title="Member Joinings"
      >
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>Failed to load analytics</p>
        </div>
      </Card>
    );
  }

  const countriesData = analyticsResponse?.data || [];
  const processedCountries = countriesData.map((item, index) => ({
    ...item,
    color: colorRotation[index % colorRotation.length],
  }));

  return (
    <Card
      className={cn("lg:col-span-2 overflow-hidden", className)}
      title="Member Joinings"
      // extra={
      //   <button className="text-[14px] font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
      //     Show All
      //   </button>
      // }
    >
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-center">
        <div className="relative w-full lg:w-[50%] h-64 lg:h-96 flex items-center justify-center bg-white overflow-hidden rounded-2xl border border-slate-100">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={() =>
                setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }))
              }
              className="w-8 h-8 bg-[#1a2d42] text-white rounded flex items-center justify-center shadow-lg"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() =>
                setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))
              }
              className="w-8 h-8 bg-[#1a2d42] text-white rounded flex items-center justify-center shadow-lg"
            >
              <Minus size={18} />
            </button>
          </div>

          <ComposableMap
            projectionConfig={{ scale: 130 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={setPosition}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  return geographies && geographies.length > 0
                    ? geographies.map((geo) => {
                        // const id = geo.id; // numeric string in world-atlas
                        const name = geo.properties.name;

                        const stats = processedCountries.find(
                          (c) => c.country === name || c.code === name,
                        );
                        let fillColor = "#F1F5F9";

                        if (stats) {
                          if (stats.color.includes("orange"))
                            fillColor = "#fbbf24";
                          else if (stats.color.includes("rose"))
                            fillColor = "#f43f5e";
                          else if (stats.color.includes("blue"))
                            fillColor = "#3b82f6";
                          else if (stats.color.includes("emerald"))
                            fillColor = "#10b981";
                          else if (stats.color.includes("purple"))
                            fillColor = "#a855f7";
                        }
                        //  else if (decorativeHighlights[id]) {
                        //   fillColor = decorativeHighlights[id];
                        // }

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fillColor}
                            stroke="#FFF"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#E2E8F0", outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    : null;
                }}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="w-full lg:w-[50%] bg-[#f8f9fc]/50 rounded-2xl p-6 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {processedCountries.map((item) => (
            <CountryProgessItem key={item.country} {...item} />
          ))}
          {processedCountries.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              No country data available
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
