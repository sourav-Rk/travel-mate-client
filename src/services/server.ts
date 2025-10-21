import { travelMateBackend } from "@/api/instance";
import type { AxiosRequestConfig,AxiosResponse } from "axios";

export const server = {
    get : <T=unknown>(url : string,config ?: AxiosRequestConfig) : Promise<T> => travelMateBackend.get<T>(url,config).then(res => res.data),
    post : <T=unknown, D=unknown>(url : string,data ?: D,config ?: AxiosRequestConfig) : Promise<T> => travelMateBackend.post<T, AxiosResponse<T>,D>(url,data,config).then(res => res.data),
    put : <T=unknown, D=unknown>(url : string,data ?: D,config ?: AxiosRequestConfig) : Promise<T> => travelMateBackend.put<T, AxiosResponse<T>,D>(url,data,config).then(res => res.data),
    patch: <T=unknown, D=unknown>(url : string,data ?: D,config ?: AxiosRequestConfig) : Promise<T> => travelMateBackend.patch<T, AxiosResponse<T>,D>(url,data,config).then(res => res.data),
    delete : <T=unknown>(url : string,config ? : AxiosRequestConfig) : Promise<T> => travelMateBackend.delete<T>(url,config).then((res) => res.data)
}