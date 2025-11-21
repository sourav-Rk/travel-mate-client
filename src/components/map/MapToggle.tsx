import type { MapLayerType } from "@/types/map";

interface MapToggleProps {
  layer: MapLayerType;
  onChange: (layer: MapLayerType) => void;
}

const tabs: Array<{ label: string; value: MapLayerType }> = [
  { label: "Volunteer Posts", value: "volunteerPosts" },
  { label: "Local Guides", value: "localGuides" },
];

export const MapToggle = ({ layer, onChange }: MapToggleProps) => {
  return (
    <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/90 p-1 text-sm font-medium shadow-lg backdrop-blur">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-4 py-2 transition ${
              layer === tab.value
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};



