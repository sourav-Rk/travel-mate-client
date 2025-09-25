import { addReview, getGuideReviews, getPackageReviews } from "@/services/client/client.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages-reviews"] });
    },
  });
};

//get package reviews
export const useGetPackageReviewsQuery = (packageId : string) => {
  return useQuery({
    queryKey: ["packages-reviews"],
    queryFn: () => getPackageReviews(packageId),
    enabled : true
  });
};


//get guide reviews
export const useGetGuideReviewsQuery = (packageId : string,guideId : string) => {
  return useQuery({
    queryKey: ["guide-reviews"],
    queryFn: () => getGuideReviews(packageId,guideId),
    enabled : true
  });
};