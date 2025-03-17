import appRequest from '@/utils/request';

export const userSetPassword = (data: any) => {
  return appRequest.post({
    url: '/user/setPassword',
    data,
  });
};

export const userChangePassword = (data: any) => {
  return appRequest.post({
    url: '/user/changePassword',
    data,
  });
};

export const userChangePhone = (data: any) => {
  return appRequest.post({
    url: '/user/changePhone',
    data,
  });
};
