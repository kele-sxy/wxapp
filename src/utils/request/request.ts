import Taro from '@tarojs/taro';
import { clearToken, getToken } from '../index';

export interface Res {
  code: number;
  data: any;
  msg: string;
}

// 定义一个全局变量来标记是否已经在跳转到登录页
let isNavigatingToLogin = false;

const handleRequestError = (error: any) => {
  // 可以根据实际需求进一步处理错误，如跳转到登录页
  // 获取当前页面路由
  const pages = Taro.getCurrentPages();
  const currentPage = pages?.pop();

  if (error?.code === 401 && currentPage?.route !== 'pages/login/index') {
    if (isNavigatingToLogin) return; //isNavigatingToLogin为true表明已经在跳转，不执行后续跳转逻辑
    isNavigatingToLogin = true; // 标记已经在跳转
    clearToken();
    Taro.reLaunch({
      url: '/pages/login/index',
      complete: () => {
        setTimeout(() => {
          isNavigatingToLogin = false; // 跳转完成后重置标记
        }, 300);
      },
    });
  } else if (error?.code !== 401 && error?.message) {
    Taro.showToast({
      title: error?.message ?? '',
      icon: 'none',
    });
  }
};

class AppRequest {
  constructor(
    private BASE_URL: string,
    private TIME_OUT: number,
  ) {}

  private interceptor(chain: Taro.Chain) {
    const requestParams = chain.requestParams;
    // Taro.showLoading({
    //   title: '加载中...',
    // })
    let token = getToken(); // 拿到本地缓存中存的token
    if (token) {
      requestParams.header = {
        ...requestParams.header,
        Authorization: 'Bearer ' + token, // 将token添加到头部
      };
    }
    // 拿到渠道 id
    const channelId = Taro.getStorageSync('channelId');
    if (channelId) {
      requestParams.data = {
        ...requestParams.data,
        channelId,
      };
    }

    return chain
      .proceed(requestParams)
      .then((res) => {
        // Taro.hideLoading()
        return res;
      })
      .catch((err) => {
        // Taro.hideLoading()
        console.error(err);
        return Promise.reject(err);
      });
  }

  request<T = any>(options: Taro.request.Option) {
    // 判断url路径是否完整
    let url: string;
    if (options.url.includes(this.BASE_URL)) {
      url = options.url;
    } else {
      url = this.BASE_URL + options.url;
    }

    // 添加拦截器
    Taro.addInterceptor(this.interceptor);
    return new Promise<T>((resolve, reject) => {
      Taro.request({
        timeout: this.TIME_OUT,
        ...options,
        url,
        success(res) {
          // 根据 statusCode 拦截接口
          if (res.statusCode === 200 && res?.data?.code === 200) {
            resolve(res.data);
          } else {
            handleRequestError(res?.data || res);
            reject(res?.data || res);
          }
        },
        fail(err) {
          handleRequestError({});
          reject(err);
        },
      });
    });
  }
  get<T = Res>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'GET' });
  }
  post<T = Res>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'POST' });
  }
  delete<T = Res>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'DELETE' });
  }
  put<T = Res>(options: Taro.request.Option) {
    return this.request<T>({ ...options, method: 'PUT' });
  }
}

export default AppRequest;
