import axios from "axios";
import { axiosInstancePrivate } from "../axiosInstance";

export async function get<R>(url: string, config = {}): Promise<R> {
  return axiosInstancePrivate.get(url, { ...config }).then(response => response.data);
}

export async function post<T, R>(url: string, data: T, config = {}): Promise<R> {
  return axiosInstancePrivate
    .post(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function put<T, R>(url: string, data: T, config = {}): Promise<R> {
  return axiosInstancePrivate
    .put(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function patch<T, R>(url: string, data: T, config = {}): Promise<R> {
  return axiosInstancePrivate
    .patch(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del<R>(url: string, config = {}): Promise<R> {
  return axiosInstancePrivate
    .delete(url, { ...config })
    .then(response => response.data);
}
