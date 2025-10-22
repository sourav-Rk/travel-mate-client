import type { PasswordChangeFormType, ResetFormType } from "@/types/authTypes";
import { server } from "../server";
import type { IGetAllAssignedPackagesResponse, IGetBookingDetailsGuideResponse, IGetBookingsGuideResponse, IGetGuideProfileResponse, IGetPackgeDetailsGuideResponse } from "@/types/api/guide";
import type { IResponse } from "@/types/Response";
import { GUIDE_API } from "@/constants/api/guide.api";
import type { ClientResponse } from "../client/client.service";
import type { CreateInstructionDto } from "@/types/instructionType";


//----------------Get Guide Profile--------------------
export const guideProfile = async () => server.get<IGetGuideProfileResponse>(GUIDE_API.GET_PROFILE);

//----------------Update Password---------------------
export const updateGuidePassword = async (data: PasswordChangeFormType) =>
  server.put<IResponse,PasswordChangeFormType>(GUIDE_API.UPDATE_PASSWORD, data);

//---------------Reset Password------------------------
export const resetPassword = async (data: ResetFormType) =>
  server.put<IResponse,ResetFormType>(GUIDE_API.RESET_PASSWORD, data);

//--------------packages----------------

//-----------get assigned packages----------
export const getAssignedPackages = async (params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) =>
  server.get<IGetAllAssignedPackagesResponse>(GUIDE_API.GET_ASSIGNED_PACKAGES, { params });

//get package details
export const getPackageDetailsGuide = async (packageId: string) => server.get<IGetPackgeDetailsGuideResponse>(GUIDE_API.GET_PACKAGE_DETAILS(packageId));


//update package status
export const updatePackageStatusGuide = async ({
  status,
  packageId,
}: {
  status: string;
  packageId: string;
}) => {
  return server.put<IResponse>(GUIDE_API.UPDATE_PACKAGE_STATUS, { status, packageId });
};

//=======================BOOKINGS================================

//get booking list for a package
export const getBookingsGuide = async(params: {
  packageId: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) => server.get<IGetBookingsGuideResponse>(GUIDE_API.GET_BOOKINGS(params.packageId), { params });

//get booking details of the user
export const getBookingDetailsGuide = async (bookingId : string) => server.get<IGetBookingDetailsGuideResponse>(GUIDE_API.GET_BOOKING_DETAILS(bookingId)); 


//=======================CLIENT DETAILS================================
export const getClientDetailsForGuide = async (clientId : string) => server.get<ClientResponse>(GUIDE_API.GET_CLIENT_DETAILS(clientId));



//=====================Instructions=========================
export const createInstruction = async(instructionData : CreateInstructionDto) => server.post<IResponse>(GUIDE_API.CREATE_INSTRUCTION,instructionData);