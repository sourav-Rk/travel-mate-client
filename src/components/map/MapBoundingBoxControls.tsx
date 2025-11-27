import { Button } from "@/components/ui/button";

interface MapBoundingBoxControlsProps {
  onUseCurrentView: () => void;
  onClear: () => void;
  hasBoundingBox: boolean;
}

export const MapBoundingBoxControls = ({
  onUseCurrentView,
  onClear,
  hasBoundingBox,
}: MapBoundingBoxControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-neutral-900">
          Area filter
        </p>
        <p className="text-xs text-neutral-500">
          Lock search to the current map view for precise results
        </p>
      </div>
      <div className="flex flex-1 justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onUseCurrentView}>
          Use current view
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          disabled={!hasBoundingBox}
        >
          Clear area
        </Button>
      </div>
    </div>
  );
};









