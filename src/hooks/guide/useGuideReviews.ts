import { getMyGuideReviews } from "@/services/guide/guide.service";
import { useQuery } from "@tanstack/react-query";

export const useGuideReviewsQuery = () => {
  return useQuery({
    queryKey: ["guide-reviews"],
    queryFn: getMyGuideReviews,
  });
};

