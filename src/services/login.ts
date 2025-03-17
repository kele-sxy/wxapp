import appRequest from '@/utils/request';

/**
 * 登录
 * @param loginType password=密码登录 code=验证码登录
 * @param data
 * @returns
 */
export const loginRequest = (loginType: 'password' | 'code', data: any) => {
  const url =
    loginType === 'password' ? '/auth/login' : '/auth/loginWithSmsCode';
  return appRequest.post({
    url,
    data,
  });
};

// 获取验证码
export const sendSmsCode = (data: { phone: any; type?: string }) => {
  return appRequest.get({
    url: '/auth/sendSmsCode',
    data,
  });
};

// 修改密码
export const setPassword = (data: { password: any }) => {
  return appRequest.get({
    url: '/user/setPassword',
    data,
  });
};

// 校验登录状态
export const checkTokenStatus = () => {
  return appRequest.post({
    url: '/auth/isLogin',
  });
};
