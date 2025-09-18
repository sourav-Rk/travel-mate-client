import { addReview, getPackageReviews } from "@/services/client/client.service";
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
