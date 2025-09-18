import type { WishlistDto } from "@/components/client/wishlist/WishlistPage";
import { useGetWishlistQuery } from "@/hooks/wishlist/useWishlist";
import { useEffect, useState } from "react";
import {motion} from 'framer-motion';
import WishlistPage from "@/components/client/wishlist/WishlistPage";

export default function WishlistPageClient() {
  const [wishlistData, setWishlistData] = useState<WishlistDto>();
  const { data, isLoading, error } = useGetWishlistQuery();

  useEffect(() => {
    if (data) {
      setWishlistData(data.wishlist);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading wishlist</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {wishlistData && <WishlistPage wishlistData={wishlistData} />}
    </motion.div>
  );
}
