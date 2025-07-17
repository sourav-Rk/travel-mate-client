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
}: {
  vendorId: string;
  status: string;
}) => {
  try {
    const response = await adminAxiosInstance.patch(
      "/_ad/admin/vendor-status",
      {},
      {
        params: {
          vendorId,
          status,
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
