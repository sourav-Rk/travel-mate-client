import { server } from "../server";



// ================== ADMIN SERVICE ==================


//-----------------Get all users with filters-----------------
export const getAllUsers = async(params: {
  userType: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}) => server.get("/admin/users", { params });



//---------------- Get details of a specific user----------------
export const getUserDetails = async(params: {userType: string;userId: string;}) => server.get("/admin/user-details", { params });



//---------------- Update vendor status (approve/reject/review)----------------
export const updateVendorStatus = async(payload: {
  vendorId: string;
  status: string;
  reason?: string;
}) => server.patch("/admin/vendor-status", payload, { params: payload });



//---------------- Block or unblock a user----------------
export const updateUserStatus = async(data: {
  userType: string;
  userId: string;
}) => server.patch("/admin/user-status", {}, { params: data });


//---------------- Get vendor KYC document signed URLs----------------
export const getVendorKycUrlsForAdmin = async(data: string[]) =>
  server.post<{ urls: string[] }>("/admin/signed-url", { data }).then(
    (res) => res.urls
  );


//----------------Get all packages with filters----------------
export const getAllPackages = async(params: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
  userType?: string;
}) => server.get("/admin/package", { params });


//----------------Get details of a specific package----------------
export const getPackageDetails = async(packageId: string, userType: string) => server.get(`/admin/package/${packageId}`, { params: { userType } });


//----------------Block or unblock a package----------------
export const updatePackageBlockStatus = async (packageId: string) =>server.put("/admin/package/block", { packageId });