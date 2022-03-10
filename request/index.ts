import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import type { RequestConfig, RequestInterceptors, CancelRequestSource } from "./type";

class Request {
  instance: AxiosInstance;
  interceptorsObj?: RequestInterceptors;
  /*
  存放取消方法的集合
  * 在创建请求后将取消请求方法 push 到该集合中
  * 封装一个方法，可以取消请求，传入 url: string|string[] 
  * 在请求之前判断同一URL是否存在，如果存在就取消请求
  */
  cancelRequestSourceList?: CancelRequestSource[];

  /*
  存放所有请求URL的集合
  * 请求之前需要将url push到该集合中
  * 请求完毕后将url从集合中删除
  * 添加在发送请求之前完成，删除在响应之后删除
  */
  requestUrlList?: string[];

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);

    this.interceptorsObj = config.interceptors;

    this.requestUrlList = [];
    this.cancelRequestSourceList = [];

    //请求拦截器
    this.instance.interceptors.request.use(
      (config: RequestConfig) => {
        // 进行一些拦截器的操作
        //判断token之类
        return config;
      },
      (err: any) => err
    );

    //实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );

    // 全局响应拦截保证最后执行

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        //进行一些响应拦截
        return res.data;
      },
      (err: any) => err
    );
  }

  request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config);
      }

      const url = config.url; //用url存在保存取消请求方法和当前请求url
      if (url) {
        this.requestUrlList?.push(url);
        config.cancelToken = new axios.CancelToken((c) => {
          this.cancelRequestSourceList?.push({
            [url]: c,
          });
        });
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors<T>(res);
          }

          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}

export default Request;
