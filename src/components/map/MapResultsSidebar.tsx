// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import type {
//   GuideLocation,
//   MapLayerType,
//   VolunteerPostLocation,
// } from "@/types/map";

// type MapResult = GuideLocation | VolunteerPostLocation;

// interface MapResultsSidebarProps {
//   layer: MapLayerType;
//   items: MapResult[];
//   isLoading: boolean;
//   isError: boolean;
//   onRetry?: () => void;
// }

// const formatDistance = (distance?: number) => {
//   if (distance === undefined) return "N/A";
//   if (distance < 1000) return `${Math.round(distance)} m`;
//   return `${(distance / 1000).toFixed(1)} km`;
// };

// const isGuide = (item: MapResult): item is GuideLocation =>
//   "userDetails" in item;

// const ResultCard = ({ item }: { item: MapResult }) => {
//   if (isGuide(item)) {
//     const fullName = `${item.userDetails?.firstName ?? ""} ${
//       item.userDetails?.lastName ?? ""
//     }`.trim();
//     return (
//       <div className="rounded-2xl border border-neutral-200 p-4 shadow-sm transition hover:border-neutral-300">
//         <div className="flex items-center justify-between">
//           <p className="text-sm font-semibold text-neutral-900">
//             {fullName || "Local guide"}
//           </p>
//           <span className="text-xs text-neutral-500">
//             {formatDistance(item.distance)}
//           </span>
//         </div>
//         <p className="text-xs text-neutral-500">
//           {item.location.city}, {item.location.state}
//         </p>
//         <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
//           <span className="rounded-full bg-neutral-100 px-3 py-1">
//             ⭐ {item.stats.averageRating.toFixed(1)} ({item.stats.totalRatings})
//           </span>
//           {item.specialties.slice(0, 2).map((spec) => (
//             <span
//               key={spec}
//               className="rounded-full bg-neutral-100 px-3 py-1 capitalize"
//             >
//               {spec}
//             </span>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-2xl border border-neutral-200 p-4 shadow-sm transition hover:border-neutral-300">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
//         <span className="text-xs text-neutral-500">
//           {formatDistance(item.distance)}
//         </span>
//       </div>
//       <p className="text-xs text-neutral-500 capitalize">{item.category}</p>
//       <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
//         {item.description}
//       </p>
//     </div>
//   );
// };

// export const MapResultsSidebar = ({
//   layer,
//   items,
//   isLoading,
//   isError,
//   onRetry,
// }: MapResultsSidebarProps) => {
//   return (
//     <aside className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
//       <div className="border-b border-neutral-100 p-4">
//         <p className="text-sm font-semibold text-neutral-900">
//           {layer === "localGuides" ? "Nearby guides" : "Volunteer posts"}
//         </p>
//         <p className="text-xs text-neutral-500">
//           {isLoading
//             ? "Fetching latest data..."
//             : `${items.length} result${items.length === 1 ? "" : "s"}`}
//         </p>
//       </div>

//       <div className="relative max-h-[440px]">
//         {isLoading ? (
//           <div className="space-y-3 p-4">
//             {Array.from({ length: 4 }).map((_, index) => (
//               <Skeleton key={index} className="h-20 w-full rounded-2xl" />
//             ))}
//           </div>
//         ) : isError ? (
//           <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
//             <p className="text-sm font-semibold text-red-500">
//               Unable to load data
//             </p>
//             <Button variant="outline" onClick={onRetry}>
//               Retry
//             </Button>
//           </div>
//         ) : (
//           <ScrollArea className="h-[440px] p-4">
//             <div className="space-y-3">
//               {items.map((item) => (
//                 <ResultCard key={item._id} item={item} />
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </div>
//     </aside>
//   );
// };



import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type {
  GuideLocation,
  MapLayerType,
  VolunteerPostLocation,
} from "@/types/map";

type MapResult = GuideLocation | VolunteerPostLocation;

interface MapResultsSidebarProps {
  layer: MapLayerType;
  items: MapResult[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

const formatDistance = (distance?: number) => {
  if (distance === undefined) return "N/A";
  if (distance < 1000) return `${Math.round(distance)} m`;
  return `${(distance / 1000).toFixed(1)} km`;
};

const isGuide = (item: MapResult): item is GuideLocation =>
  "userDetails" in item;

const ResultCard = ({ item }: { item: MapResult }) => {
  if (isGuide(item)) {
    const fullName = `${item.userDetails?.firstName ?? ""} ${
      item.userDetails?.lastName ?? ""
    }`.trim();
    const initials = fullName
      ? fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "LG";

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-neutral-300 hover:-translate-y-1">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative p-4">
          {/* Header with profile image and info */}
          <div className="flex items-start gap-3">
            {/* Profile Image */}
            <div className="relative shrink-0">
              {item.profileImage ? (
                <img
                  src={item.profileImage}
                  alt={fullName}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm ring-2 ring-white shadow-md">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-white shadow-sm">
                <svg
                  className="h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                  {fullName || "Local guide"}
                </h3>
                <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {formatDistance(item.distance)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                📍 {item.location.city}, {item.location.state}
              </p>
            </div>
          </div>

          {/* Stats and badges */}
          <div className="mt-4 space-y-2">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 border border-blue-100">
                <span className="text-base">⭐</span>
                <span className="text-sm font-semibold text-blue-900">
                  {item.stats.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-blue-600">
                  ({item.stats.totalRatings})
                </span>
              </div>
              
              {/* Hourly rate */}
              <div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 border border-emerald-100">
                <span className="text-sm font-bold text-emerald-700">
                  ₹{item.hourlyRate}
                </span>
                <span className="text-xs text-emerald-600 font-medium">
                  /hr
                </span>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5">
              {item.specialties.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 capitalize border border-neutral-200"
                >
                  {spec}
                </span>
              ))}
              {item.specialties.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                  +{item.specialties.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-neutral-300 hover:-translate-y-1">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        {/* Post Image */}
        {item.images && item.images.length > 0 ? (
          <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
            <img
              src={item.images[0]}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Image count badge */}
            {item.images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {item.images.length}
              </div>
            )}
            {/* Distance badge */}
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {formatDistance(item.distance)}
            </div>
          </div>
        ) : (
          // Fallback gradient when no image
          <div className="relative h-40 w-full bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {formatDistance(item.distance)}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Title and category */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 flex-1">
                {item.title}
              </h3>
            </div>
            
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-1 border border-purple-100">
              <svg
                className="h-3 w-3 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-purple-700 capitalize">
                {item.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-3 line-clamp-2 text-sm text-neutral-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const MapResultsSidebar = ({
  layer,
  items,
  isLoading,
  isError,
  onRetry,
}: MapResultsSidebarProps) => {
  return (
    <aside className="rounded-3xl border border-neutral-200 bg-white shadow-lg">
      <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              layer === "localGuides" 
                ? "bg-blue-500 animate-pulse" 
                : "bg-emerald-500 animate-pulse"
            }`} />
            <p className="text-sm font-bold text-neutral-900">
              {layer === "localGuides" ? "Nearby Guides" : "Volunteer Posts"}
            </p>
          </div>
          <p className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            {isLoading
              ? "Loading..."
              : `${items.length} result${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="relative max-h-[440px]">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-neutral-200 p-4">
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Unable to load data
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Please check your connection and try again
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="rounded-full"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <svg
                className="h-8 w-8 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                No results found
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try adjusting your search or location
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[440px] p-4">
            <div className="space-y-3">
              {items.map((item) => (
                <ResultCard key={item._id} item={item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </aside>
  );
};
