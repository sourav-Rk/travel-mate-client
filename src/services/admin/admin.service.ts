import { adminAxiosInstance } from "@/api/admin.axios";

//----get all users api --------
export const getAllUsers = async ({
  userType,
  page = 1,
  limit = 10,
  searchTerm,
  status,
}: {
  userType: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) => {
  try {
    const response = await adminAxiosInstance.get("/_ad/admin/users", {
      params: {
        userType,
        page,
        limit,
        searchTerm,
        status,
      },
    });
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//------get user details api----------
export const getUserDetails = async ({
  userType,
  userId,
}: {
  userType: string;
  userId: string;
}) => {
  try {
    const response = await adminAxiosInstance.get("/_ad/admin/user-details", {
      params: {
        userType,
        userId,
      },
    });
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//--------update vendor status api---------
export const updateVendorStatus = async ({
  vendorId,
  status,
  reason
}: {
  vendorId: string;
  status: string;
  reason ?: string
}) => {
  try {
    const response = await adminAxiosInstance.patch(
      "/_ad/admin/vendor-status",
      {vendorId,status,reason},
      {
        params: {
          vendorId,
          status,
          reason
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//-----------block and unblock users------------
export const updateUserStatus = async (data: {
  userType: string;
  userId: any;
}) => {
  try {
    const response = await adminAxiosInstance.patch(
      "/_ad/admin/user-status",
      {},
      {
        params: {
          userType: data.userType,
          userId: data.userId,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//view the vendor docuements
export const getVendorKycUrlsForAdmin = async(data : string[]) : Promise<string[]> =>{
  try{
    const response = await adminAxiosInstance.post("/_ad/admin/signed-url",{data});
    return response.data.urls;
  }catch(error : any){
    return error?.response?.data.message || error;
  }
}

//-------get packages api----------
export const getAllPackages = async ({
  page = 1,
  limit = 5,
  searchTerm,
  status,
  category,
  userType
}: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  category: string;
  userType : string;
}) => {
  const response = await adminAxiosInstance.get("/_ad/admin/package", {
    params: {
      page,
      limit,
      searchTerm,
      status,
      category,
      userType
    },
  });
  return response.data;
};

//---------get package details api---------
export const getPackageDetails = async(packageId : string,userType : string) =>{
    try{
      const response = await adminAxiosInstance.get(`/_ad/admin/package/${packageId}`,{params : {userType}});
      return response.data;
    }catch(error: any){
       throw error;
    }
}


//-------block or unblock packages
export const updatePackageBlockStatus = async(packageId : string) => {
  const response = await adminAxiosInstance.put("/_ad/admin/package/block",{packageId});
  return response.data;
}
