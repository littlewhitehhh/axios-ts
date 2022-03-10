import Request from "./request";
import { RequestConfig } from "./request/type";

//类实例化
const request = new Request({
  baseURL: "www.baidu,com",
  timeout: 1000 * 60 * 5,
  interceptors: {
    //请求拦截// 请求拦截器
    requestInterceptors: (config) => {
      console.log("实例请求拦截器");

      return config;
    },
    // 响应拦截器
    responseInterceptors: (result) => {
      console.log("实例响应拦截器");
      return result;
    },
  },
});

//封装请求方法发送网络请求

interface AkyRequestConfig<T> extends RequestConfig {
  data?: T;
}

interface AkyResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * @description: 函数的描述
 * @interface D 请求参数的interface
 * @interface T 响应结构的intercept
 * @param {YWZRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */

const AkyRequest = <D, T = any>(config: AkyRequestConfig<D>) => {
  const { method = "GET" } = config;
  if (method === "get" || method === "GET") {
    config.params = config.data;
  }
  return request.request<AkyResponse<T>>(config);
};
export default AkyRequest;
