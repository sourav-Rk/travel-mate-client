import { server } from "../server";

// //----get all users api --------
// export const getAllUsers = async ({
//   userType,
//   page = 1,
//   limit = 10,
//   searchTerm,
//   status,
// }: {
//   userType: string;
//   page: number;
//   limit: number;
//   searchTerm: string;
//   status: string;
// }) => {
//   try {
//     const response = await travelMateBackend.get("/admin/users", {
//       params: {
//         userType,
//         page,
//         limit,
//         searchTerm,
//         status,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //------get user details api----------
// export const getUserDetails = async ({
//   userType,
//   userId,
// }: {
//   userType: string;
//   userId: string;
// }) => {
//   try {
//     const response = await travelMateBackend.get("/admin/user-details", {
//       params: {
//         userType,
//         userId,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //--------update vendor status api---------
// export const updateVendorStatus = async ({
//   vendorId,
//   status,
//   reason
// }: {
//   vendorId: string;
//   status: string;
//   reason ?: string
// }) => {
//   try {
//     const response = await travelMateBackend.patch(
//       "/admin/vendor-status",
//       {vendorId,status,reason},
//       {
//         params: {
//           vendorId,
//           status,
//           reason
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //-----------block and unblock users------------
// export const updateUserStatus = async (data: {
//   userType: string;
//   userId: any;
// }) => {
//   try {
//     const response = await travelMateBackend.patch(
//       "/admin/user-status",
//       {},
//       {
//         params: {
//           userType: data.userType,
//           userId: data.userId,
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //view the vendor docuements
// export const getVendorKycUrlsForAdmin = async(data : string[]) : Promise<string[]> =>{
//   try{
//     const response = await travelMateBackend.post("/admin/signed-url",{data});
//     return response.data.urls;
//   }catch(error : any){
//     return error?.response?.data.message || error;
//   }
// }

// //-------get packages api----------
// export const getAllPackages = async ({
//   page = 1,
//   limit = 5,
//   searchTerm,
//   status,
//   category,
//   userType
// }: {
//   page: number;
//   limit: number;
//   searchTerm: string;
//   status: string;
//   category: string;
//   userType : string;
// }) => {
//   const response = await travelMateBackend.get("/admin/package", {
//     params: {
//       page,
//       limit,
//       searchTerm,
//       status,
//       category,
//       userType
//     },
//   });
//   return response.data;
// };

// //---------get package details api---------
// export const getPackageDetails = async(packageId : string,userType : string) =>{
//     try{
//       const response = await travelMateBackend.get(`/admin/package/${packageId}`,{params : {userType}});
//       return response.data;
//     }catch(error: any){
//        throw error;
//     }
// }


// //-------block or unblock packages
// export const updatePackageBlockStatus = async(packageId : string) => {
//   const response = await travelMateBackend.put("/admin/package/block",{packageId});
//   return response.data;
// }


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