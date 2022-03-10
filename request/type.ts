import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestInterceptors {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;

  responseInterceptors?: <T = AxiosResponse>(res: T) => T;
  responseInterceptorsCatch?: (err: any) => any;
}

export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
}

export interface CancelRequestSource {
  [index: string]: () => void;
}
