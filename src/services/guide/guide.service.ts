import type { PasswordChangeFormType } from "@/types/authTypes";
import { server } from "../server";
import type { IGetAllAssignedPackages, IGetBookingDetailsGuideDto, IGetBookingsGuide } from "@/types/api/guide";
import type { IResponse } from "@/types/Response";

//----------------Get Guide Profile--------------------
export const guideProfile = async () => server.get("/guide/details");

//----------------Update Password---------------------
export const updateGuidePassword = async (data: PasswordChangeFormType) =>
  server.put("/guide/update-password", data);

//---------------Reset Password------------------------
export const resetPassword = async (data: PasswordChangeFormType) =>
  server.put("/guide/reset-password", data);

//--------------packages----------------

//-----------get assigned packages----------
export const getAssignedPackages = async (params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) =>
  server.get<IGetAllAssignedPackages>("/guide/assigned-packages", { params });

//get package details
export const getPackageDetailsGuide = async (packageId: string) => server.get(`/guide/package/${packageId}`);


//update package status
export const updatePackageStatusGuide = async ({
  status,
  packageId,
}: {
  status: string;
  packageId: string;
}) => {
  return server.put<IResponse>('/guide/package/status', { status, packageId });
};

//=======================BOOKINGS================================

//get booking list for a package
export const getBookingsGuide = async(params: {
  packageId: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) => server.get<IGetBookingsGuide>(`/guide/bookings/${params.packageId}`, { params });

//get booking details of the user
export const getBookingDetailsGuide = async (bookingId : string) => server.get<IGetBookingDetailsGuideDto>(`/guide/bookings/user/${bookingId}`); 
