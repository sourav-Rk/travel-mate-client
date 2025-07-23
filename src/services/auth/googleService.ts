import { authAxiosInstance } from "@/api/auth.axios";
import type { AuthResponse } from "./authService";

export const googleAuth = async ({
  credential,
  client_id,
  role,
}: {
  credential: any;
  client_id: any;
  role: string;
}): Promise<AuthResponse> => {
  try {
    const response = await authAxiosInstance.post<AuthResponse>(
      "/google-auth",
      {
        credential,
        client_id,
        role,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
