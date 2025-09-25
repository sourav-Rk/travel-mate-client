import { travelMateBackend } from "@/api/instance";
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
    const response = await travelMateBackend.post<AuthResponse>(
      "/auth/google-auth",
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
