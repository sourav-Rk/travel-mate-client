import { addReview, getGuideReviews, getPackageReviews } from "@/services/client/client.service";
import { getPackageReviewsVendor } from "@/services/vendor/vendorService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages-reviews","guide-reviews"] });
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


//get package reviews query for vendor
export const useGetPackageReviewsVendorQuery =(packageId : string) => {
  return useQuery({
    queryKey: ["packages-reviews-vendor"],
    queryFn: () => getPackageReviewsVendor(packageId),
    enabled : !!packageId
  });
};