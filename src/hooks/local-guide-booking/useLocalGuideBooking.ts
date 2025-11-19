import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuote,
  acceptQuote,
  declineQuote,
  payAdvanceAmount,
  payFullAmount,
  getLocalGuideBookings,
  getLocalGuideBookingDetails,
  markServiceComplete,
} from "@/services/local-guide-booking/localGuideBooking.service";
import type {
  CreateQuoteRequest,
  LocalGuideBookingsQuery,
  LocalGuideBookingListResponse,
  LocalGuideBooking,
} from "@/types/local-guide-booking";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuoteRequest) => createQuote(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "pending-quotes"] });
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create quote. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useAcceptQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: string) => acceptQuote(quoteId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "pending-quotes"] });
      toast.success(data.message || "Quote accepted! Booking created.");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to accept quote. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useDeclineQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quoteId, reason }: { quoteId: string; reason?: string }) =>
      declineQuote(quoteId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "pending-quotes"] });
      toast.success(data.message || "Quote declined");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to decline quote. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const usePayAdvanceAmount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, amount }: { bookingId: string; amount: number }) =>
      payAdvanceAmount(bookingId, amount),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["local-guide-booking"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "rooms"] });
      
      toast.success(response.message);
      
      // Redirect to Stripe checkout using Stripe.js
      const sessionId = (response as { data?: { sessionId?: string } }).data?.sessionId;
      if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        } else {
          toast.error("Failed to load Stripe. Please try again.");
        }
      }
    },
    onError: (error: any) => {
      const errorMessage =
       error?.response.data?.message ? error.response.data.message
          : "Failed to create payment session. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const usePayFullAmount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, amount }: { bookingId: string; amount: number }) =>
      payFullAmount(bookingId, amount),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["local-guide-booking"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "rooms"] });
      
      toast.success(response.message || "Payment session created");
      
      // Redirect to Stripe checkout using Stripe.js
      const sessionId = (response as { data?: { sessionId?: string } }).data?.sessionId;
      if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        } else {
          toast.error("Failed to load Stripe. Please try again.");
        }
      }
    },
    onError: (error: any) => {
      const errorMessage =
       error?.response.data?.message ? error.response.data.message
          : "Failed to create payment session. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useLocalGuideBookings = (params: LocalGuideBookingsQuery) => {
  return useQuery<LocalGuideBookingListResponse>({
    queryKey: ["local-guide-bookings", params],
    queryFn: () => getLocalGuideBookings(params),
    placeholderData:(previousData) => previousData,
  });
};

export const useLocalGuideBookingDetails = (bookingId: string | undefined) => {
  return useQuery<LocalGuideBooking>({
    queryKey: ["local-guide-booking", bookingId],
    queryFn: () => {
      if (!bookingId) {
        throw new Error("Booking ID is required");
      }
      return getLocalGuideBookingDetails(bookingId).then((response) => response.booking);
    },
    enabled: !!bookingId,
  });
};

export const useMarkServiceComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, notes, rating }: { bookingId: string; notes?: string; rating?: number }) =>
      markServiceComplete(bookingId, notes, rating),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["local-guide-booking"] });
      queryClient.invalidateQueries({ queryKey: ["local-guide-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["local-guide-bookings-guide"] });
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "rooms"] });
      toast.success(data.message || "Service marked as complete successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark service as complete. Please try again.";
      toast.error(errorMessage);
    },
  });
};

