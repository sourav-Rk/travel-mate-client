import type { IResponse } from "../Response";

export type LoginResponse = IResponse & {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
  };
};
