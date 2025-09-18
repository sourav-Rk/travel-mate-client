import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/services/client/client.service";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//get wishlist
export const useGetWishlistQuery = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });
};

//add to wishlist
export const useAddToWishlistMutation = () => {
  const queryClient =  useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};

//remove from wishlist
export const useRemoveFromWishlistMutation = () => {
  const queryClient =  useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};
