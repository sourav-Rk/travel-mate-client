interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLocate?: () => void;
  isLocateDisabled?: boolean;
}

export const MapControls = ({
  onZoomIn,
  onZoomOut,
  onLocate,
  isLocateDisabled,
}: MapControlsProps) => {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur">
      <button
        type="button"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className="rounded-lg bg-neutral-900 px-3 py-2 text-white transition hover:bg-neutral-800"
      >
        +
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="rounded-lg bg-neutral-900 px-3 py-2 text-white transition hover:bg-neutral-800"
      >
        −
      </button>
      <button
        type="button"
        aria-label="Recenter to your location"
        onClick={onLocate}
        disabled={isLocateDisabled}
        className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-inner transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Locate
      </button>
    </div>
  );
};










